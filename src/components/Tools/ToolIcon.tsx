import type { SVGProps } from "react";
import type { IconKey } from "../../types/tool";
import { ICON_PATHS } from "../../data/tools";

export function ToolIcon({ icon, ...props }: { icon: IconKey } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      {ICON_PATHS[icon].map((seg, i) => {
        if ("d" in seg) return <path key={i} d={seg.d} />;
        if ("line" in seg) {
          const [x1, y1, x2, y2] = seg.line;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        }
        const [cx, cy, r] = seg.circle;
        return <circle key={i} cx={cx} cy={cy} r={r} />;
      })}
    </svg>
  );
}
