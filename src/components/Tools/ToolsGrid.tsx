import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import type { Tool } from "../../types/tool";
import type { ToolFormValues } from "./ToolForm";
import { ToolCard } from "./ToolCard";
import { AddTile } from "./AddTile";

export function ToolsGrid({
  tools,
  onReorder,
  onAddTool,
  onEditTool,
}: {
  tools: Tool[];
  onReorder: (tools: Tool[]) => void;
  onAddTool: (values: ToolFormValues) => void;
  onEditTool: (key: string, values: ToolFormValues) => void;
}) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tools.findIndex(t => t.key === active.id);
    const newIndex = tools.findIndex(t => t.key === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(tools, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tools.map(t => t.key)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1020px]:grid-cols-3">
          {tools.map(tool => (
            <ToolCard
              key={tool.key}
              tool={tool}
              editing={editingKey === tool.key}
              onStartEdit={() => setEditingKey(tool.key)}
              onCancelEdit={() => setEditingKey(null)}
              onSave={values => {
                onEditTool(tool.key, values);
                setEditingKey(null);
              }}
            />
          ))}
          <AddTile onAdd={onAddTool} />
        </div>
      </SortableContext>
    </DndContext>
  );
}
