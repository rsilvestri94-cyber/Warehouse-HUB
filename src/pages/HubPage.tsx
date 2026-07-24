import { useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useAuthGate } from "../firebase/useAuthGate";
import { useHubData } from "../firebase/useHubData";
import { AuthGate } from "../components/AuthGate/AuthGate";
import { Hero } from "../components/Hero/Hero";
import { AdminInfoModal } from "../components/Hero/AdminInfoModal";
import { Footer } from "../components/Footer";
import { ToolsGrid } from "../components/Tools/ToolsGrid";
import { TodoPanel } from "../components/Sidebar/TodoPanel";
import { CommentsPanel } from "../components/Sidebar/CommentsPanel";
import { DriveLinkCard } from "../components/Sidebar/DriveLinkCard";
import { ArchiveSection } from "../components/Archive/ArchiveSection";
import { PrintToolSection } from "../components/PrintTool/PrintToolSection";
import { defaultCta } from "../data/tools";
import type { ToolFormValues } from "../components/Tools/ToolForm";

export function HubPage() {
  const { lang, t } = useI18n();
  const gate = useAuthGate();
  const approved = gate.state === "approved";
  const hub = useHubData(approved);
  const [adminInfoOpen, setAdminInfoOpen] = useState(false);

  const authorName = gate.user?.displayName || gate.user?.email || t.defaultUserName;

  const handleAddTool = (values: ToolFormValues) => {
    hub.addTool({
      title: { it: values.title, en: values.title },
      description: { it: values.description, en: values.description },
      url: values.url,
      icon: values.icon,
      color: values.color || undefined,
      cta: { it: defaultCta(values.icon, "it"), en: defaultCta(values.icon, "en") },
    });
  };

  const handleEditTool = (key: string, values: ToolFormValues) => {
    const current = hub.tools.find(tool => tool.key === key);
    hub.editTool(key, {
      title: { ...current?.title, [lang]: values.title } as { it: string; en: string },
      description: { ...current?.description, [lang]: values.description } as { it: string; en: string },
      url: values.url,
      icon: values.icon,
      color: values.color || undefined,
    });
  };

  return (
    <>
      {!approved && <AuthGate gate={gate} />}

      {approved && (
        <div className="min-h-screen">
          <Hero
            isAdmin={gate.isAdmin}
            userName={authorName}
            onSignOut={gate.signOut}
            onOpenAdminInfo={() => setAdminInfoOpen(true)}
          />

          <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6">
            <section>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-1">
                <div className="font-heading text-xs font-bold uppercase tracking-wide text-blue-mid">{t.toolsLabel}</div>
                <span className="text-xs text-ink/50">{t.toolsHint}</span>
              </div>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[380px_1fr]">
                <aside className="flex flex-col gap-4">
                  <TodoPanel
                    todos={hub.todos}
                    unseenIds={hub.unseenTodoIds}
                    onAdd={(text, priority) => hub.addTodo(text, priority, authorName)}
                    onToggle={hub.toggleTodo}
                    onSetPriority={hub.setTodoPriority}
                    onEditText={hub.editTodoText}
                    onDelete={hub.deleteTodo}
                    onSeen={() => hub.clearUnseen("todo")}
                  />
                  <CommentsPanel
                    comments={hub.comments}
                    unseenIds={hub.unseenCommentIds}
                    syncStatus={hub.syncStatus}
                    onAdd={text => hub.addComment(text, authorName)}
                    onEditText={hub.editCommentText}
                    onDelete={hub.deleteComment}
                    onSeen={() => hub.clearUnseen("comments")}
                  />
                  <DriveLinkCard />
                </aside>
                <ToolsGrid tools={hub.tools} onReorder={hub.reorderTools} onAddTool={handleAddTool} onEditTool={handleEditTool} />
              </div>
            </section>

            <ArchiveSection />
            <PrintToolSection />
          </main>

          <Footer />
        </div>
      )}

      <AdminInfoModal open={adminInfoOpen} onClose={() => setAdminInfoOpen(false)} />
    </>
  );
}
