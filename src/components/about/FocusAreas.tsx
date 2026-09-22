import { aboutCopy } from "@/lib/about";

export function FocusAreas() {
  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-foreground">
        {aboutCopy.focusTitle}
      </h2>
      <ul className="mt-5 flex flex-wrap gap-2">
        {aboutCopy.focusAreas.map((area) => (
          <li
            key={area}
            className="border border-border px-2.5 py-1 font-mono text-[11px] tracking-wide text-foreground"
          >
            {area}
          </li>
        ))}
      </ul>
    </div>
  );
}
