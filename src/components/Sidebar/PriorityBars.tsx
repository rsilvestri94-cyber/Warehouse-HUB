import type { Priority } from "../../types/todo";
import { PRIORITY_COLORS } from "../../data/tools";

const LEVELS: Priority[] = [1, 2, 3];

export function PriorityBars({
  value,
  onSelect,
  compact,
}: {
  value: Priority;
  onSelect: (p: Priority) => void;
  compact?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {LEVELS.map(level => (
        <button
          key={level}
          type="button"
          onClick={e => {
            e.stopPropagation();
            onSelect(level);
          }}
          className={`rounded-sm transition ${compact ? "h-1.5 w-4" : "h-2 w-6"} ${level > value ? "opacity-25" : ""}`}
          style={{ background: PRIORITY_COLORS[level] }}
        />
      ))}
    </div>
  );
}
