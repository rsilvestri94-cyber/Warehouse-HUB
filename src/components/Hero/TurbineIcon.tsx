import type { SVGProps } from "react";

export function TurbineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 220" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="47" y="70" width="6" height="150" fill="currentColor" />
      <circle cx="50" cy="66" r="5" fill="currentColor" />
      <path d="M50 66 C 30 56, 14 66, 6 50 C 24 48, 40 54, 50 66Z" fill="currentColor" />
      <path d="M50 66 C 66 50, 86 52, 96 36 C 84 52, 74 64, 50 66Z" fill="currentColor" />
      <path d="M50 66 C 56 88, 46 104, 58 120 C 46 106, 40 88, 50 66Z" fill="currentColor" />
    </svg>
  );
}
