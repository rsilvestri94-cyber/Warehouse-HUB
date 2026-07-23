import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Tool, ToolPrefs } from "../types/tool";
import type { Todo, Priority } from "../types/todo";
import type { Comment } from "../types/comment";
import { EMPTY_PREFS } from "../types/tool";
import { composeTools } from "../lib/composeTools";
import { commentsApi, prefsApi, todosApi, watchComments, watchTodos } from "./collections";
import { ring } from "./notifySound";
import { auth } from "./config";

export type SyncStatusKey = "syncSynced" | "syncError" | "";

function newToolKey(): string {
  return "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Hydrates and orchestrates everything that only makes sense once someone is
// signed in and approved: personal tool layout, live todos/comments, and the
// "someone else just added something" chime + unseen-badge tracking.
export function useHubData(active: boolean) {
  const [prefs, setPrefsState] = useState<ToolPrefs>(EMPTY_PREFS);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatusKey>("");
  const [unseenTodoIds, setUnseenTodoIds] = useState<Set<string>>(new Set());
  const [unseenCommentIds, setUnseenCommentIds] = useState<Set<string>>(new Set());

  const todosPrimed = useRef(false);
  const commentsPrimed = useRef(false);

  useEffect(() => {
    if (!active) {
      setPrefsState(EMPTY_PREFS);
      setPrefsLoaded(false);
      setTodos([]);
      setComments([]);
      setSyncStatus("");
      setUnseenTodoIds(new Set());
      setUnseenCommentIds(new Set());
      todosPrimed.current = false;
      commentsPrimed.current = false;
      return;
    }

    let cancelled = false;

    // Load the personal layout before starting listeners, so the grid
    // appears already arranged rather than visibly rearranging itself.
    prefsApi.load().then(loaded => {
      if (cancelled) return;
      setPrefsState(loaded || EMPTY_PREFS);
      setPrefsLoaded(true);
    });

    function ringForAdds(addedIds: string[], items: Array<{ id: string; authorEmail?: string }>, kind: "todo" | "comments") {
      const me = (auth.currentUser?.email || "").toLowerCase();
      const newIds = addedIds.filter(id => {
        const author = (items.find(i => i.id === id)?.authorEmail || "").toLowerCase();
        return !author || author !== me;
      });
      if (newIds.length) {
        ring();
        if (kind === "todo") setUnseenTodoIds(prev => new Set([...prev, ...newIds]));
        else setUnseenCommentIds(prev => new Set([...prev, ...newIds]));
      }
    }

    const unsubTodos = watchTodos(
      (list, addedIds) => {
        if (!todosPrimed.current) {
          todosPrimed.current = true;
        } else {
          ringForAdds(addedIds, list, "todo");
        }
        setTodos(list);
        setSyncStatus("syncSynced");
      },
      () => setSyncStatus("syncError"),
    );

    const unsubComments = watchComments(
      (list, addedIds) => {
        if (!commentsPrimed.current) {
          commentsPrimed.current = true;
        } else {
          ringForAdds(addedIds, list, "comments");
        }
        setComments(list);
        setSyncStatus("syncSynced");
      },
      () => setSyncStatus("syncError"),
    );

    return () => {
      cancelled = true;
      unsubTodos();
      unsubComments();
      todosPrimed.current = false;
      commentsPrimed.current = false;
    };
  }, [active]);

  const tools = useMemo(() => composeTools(prefs), [prefs]);

  const persistPrefs = useCallback((next: ToolPrefs) => {
    setPrefsState(next);
    if (!prefsLoaded) return; // never save before we've loaded, or we'd wipe
    void prefsApi.save(next);
  }, [prefsLoaded]);

  const reorderTools = useCallback(
    (orderedTools: Tool[]) => {
      persistPrefs({ ...prefs, order: orderedTools.map(t => t.key) });
    },
    [prefs, persistPrefs],
  );

  const addTool = useCallback(
    (input: Omit<Tool, "key">) => {
      const tool: Tool = { ...input, key: newToolKey() };
      const nextCustom = [...prefs.custom, tool];
      const nextTools = composeTools({ ...prefs, custom: nextCustom });
      persistPrefs({ ...prefs, custom: nextCustom, order: nextTools.map(t => t.key) });
    },
    [prefs, persistPrefs],
  );

  const editTool = useCallback(
    (key: string, patch: Partial<Tool>) => {
      const isCustom = prefs.custom.some(t => t.key === key);
      if (isCustom) {
        persistPrefs({
          ...prefs,
          custom: prefs.custom.map(t => (t.key === key ? { ...t, ...patch, key } : t)),
        });
      } else {
        persistPrefs({
          ...prefs,
          overrides: { ...prefs.overrides, [key]: { ...prefs.overrides[key], ...patch } },
        });
      }
    },
    [prefs, persistPrefs],
  );

  const addTodo = useCallback((text: string, priority: Priority, author: string) => {
    if (!text.trim()) return;
    void todosApi.add({ text: text.trim(), done: false, priority, author });
  }, []);
  const toggleTodo = useCallback((item: Todo) => {
    void todosApi.update(item.id, { done: !item.done });
  }, []);
  const setTodoPriority = useCallback((item: Todo, priority: Priority) => {
    void todosApi.update(item.id, { priority });
  }, []);
  const editTodoText = useCallback((item: Todo, text: string) => {
    if (!text.trim() || text === item.text) return;
    void todosApi.update(item.id, { text: text.trim() });
  }, []);
  const deleteTodo = useCallback((item: Todo) => {
    void todosApi.remove(item.id);
  }, []);

  const addComment = useCallback((text: string, author: string) => {
    if (!text.trim()) return;
    void commentsApi.add({ text: text.trim(), author });
  }, []);
  const editCommentText = useCallback((item: Comment, text: string) => {
    if (!text.trim() || text === item.text) return;
    void commentsApi.update(item.id, { text: text.trim() });
  }, []);
  const deleteComment = useCallback((item: Comment) => {
    void commentsApi.remove(item.id);
  }, []);

  const clearUnseen = useCallback((kind: "todo" | "comments") => {
    if (kind === "todo") setUnseenTodoIds(new Set());
    else setUnseenCommentIds(new Set());
  }, []);

  return {
    tools,
    reorderTools,
    addTool,
    editTool,
    todos,
    addTodo,
    toggleTodo,
    setTodoPriority,
    editTodoText,
    deleteTodo,
    comments,
    addComment,
    editCommentText,
    deleteComment,
    syncStatus,
    unseenTodoIds,
    unseenCommentIds,
    clearUnseen,
  };
}
