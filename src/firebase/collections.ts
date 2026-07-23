import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { auth, db } from "./config";
import type { Todo } from "../types/todo";
import type { Comment } from "../types/comment";
import type { ToolPrefs } from "../types/tool";

function currentEmail(): string {
  return (auth.currentUser?.email || "").toLowerCase();
}

// Firestore hands back a Timestamp (and null for the brief moment before the
// server confirms a local write). The rest of the app expects a plain ISO
// string, so normalise it here.
function normalize<T>(d: QueryDocumentSnapshot<DocumentData>): T {
  const data = d.data() || {};
  const ts = data.createdAt;
  let iso: string;
  if (ts && typeof ts.toDate === "function") iso = ts.toDate().toISOString();
  else if (typeof data.date === "string") iso = data.date;
  else iso = new Date().toISOString();
  return { ...data, id: d.id, date: iso } as T;
}

export function watchTodos(
  onData: (todos: Todo[], addedIds: string[]) => void,
  onError: (err: unknown) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, "todos"), orderBy("createdAt", "asc")),
    snap => {
      const addedIds = snap
        .docChanges()
        .filter(ch => ch.type === "added")
        .map(ch => ch.doc.id);
      onData(snap.docs.map(d => normalize<Todo>(d)), addedIds);
    },
    onError,
  );
}

export function watchComments(
  onData: (comments: Comment[], addedIds: string[]) => void,
  onError: (err: unknown) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, "comments"), orderBy("createdAt", "desc")),
    snap => {
      const addedIds = snap
        .docChanges()
        .filter(ch => ch.type === "added")
        .map(ch => ch.doc.id);
      onData(snap.docs.map(d => normalize<Comment>(d)), addedIds);
    },
    onError,
  );
}

// Exposed alongside each snapshot so the caller can tell whether a newly
// "added" doc was authored by someone else (used to decide whether to ring /
// mark unseen) without a second Firestore read.
export function docAuthorEmail(
  addedId: string,
  items: Array<{ id: string; authorEmail?: string }>,
): string {
  return (items.find(i => i.id === addedId)?.authorEmail || "").toLowerCase();
}

export const todosApi = {
  add: (data: { text: string; done: boolean; priority: 1 | 2 | 3; author: string }) =>
    addDoc(collection(db, "todos"), {
      ...data,
      authorEmail: currentEmail(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch(e => console.error("[sync] add todo failed:", e)),
  update: (id: string, data: Partial<Todo>) =>
    updateDoc(doc(db, "todos", id), { ...data, updatedAt: serverTimestamp() }).catch(e =>
      console.error("[sync] update todo failed:", e),
    ),
  remove: (id: string) =>
    deleteDoc(doc(db, "todos", id)).catch(e => console.error("[sync] delete todo failed:", e)),
};

export const commentsApi = {
  add: (data: { text: string; author: string }) =>
    addDoc(collection(db, "comments"), {
      ...data,
      authorEmail: currentEmail(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }).catch(e => console.error("[sync] add comment failed:", e)),
  update: (id: string, data: Partial<Comment>) =>
    updateDoc(doc(db, "comments", id), { ...data, updatedAt: serverTimestamp() }).catch(e =>
      console.error("[sync] update comment failed:", e),
    ),
  remove: (id: string) =>
    deleteDoc(doc(db, "comments", id)).catch(e => console.error("[sync] delete comment failed:", e)),
};

export const prefsApi = {
  // Personal tool layout, one document per account. Not shared, not
  // realtime: it's yours, and it follows you from the PC to the phone.
  load: async (): Promise<ToolPrefs | null> => {
    const u = auth.currentUser;
    if (!u) return null;
    const email = (u.email || "").toLowerCase();
    try {
      const snap = await getDoc(doc(db, "prefs", email));
      return snap.exists() ? (snap.data() as ToolPrefs) : null;
    } catch (e) {
      console.error("[prefs] load failed:", e);
      return null; // fall back to the plain catalogue rather than blocking
    }
  },
  save: (data: ToolPrefs) => {
    const u = auth.currentUser;
    if (!u) return;
    const email = (u.email || "").toLowerCase();
    return setDoc(doc(db, "prefs", email), { ...data, updatedAt: serverTimestamp() }).catch(e =>
      console.error("[prefs] save failed:", e),
    );
  },
};
