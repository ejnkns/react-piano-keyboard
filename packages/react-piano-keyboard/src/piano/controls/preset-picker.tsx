import { useCallback, useRef, useState } from "react";
import type { Audio, UseMusicNotes } from "../../use-piano/use-music-notes";
import { PRESETS } from "./presets";

export const PresetPicker = ({ set }: { set: UseMusicNotes["set"] }) => {
  const [active, setActive] = useState("Default");
  const containerRef = useRef<HTMLDivElement>(null);

  const apply = (name: string, opts: Partial<Audio.SetOptions>) => {
    setActive(name);
    set(opts);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const cur = PRESETS.findIndex((p) => p.name === active);
      let next = cur;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          next = Math.min(cur + 1, PRESETS.length - 1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          next = Math.max(cur - 1, 0);
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = PRESETS.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      if (next !== cur) {
        const p = PRESETS[next]!;
        apply(p.name, p.opts);
        const btns = containerRef.current?.querySelectorAll<HTMLButtonElement>("[role=radio]");
        btns?.[next]?.focus();
      }
    },
    [active],
  );

  return (
    <div className="flex flex-col items-center gap-1.5 px-2 py-1">
      <span id="presets-label" className="text-[10px] font-semibold text-piano-text-muted tracking-[0.05em] uppercase font-mono">
        Presets
      </span>
      <div
        ref={containerRef}
        role="radiogroup"
        aria-labelledby="presets-label"
        className="bg-piano-bg-tertiary border border-piano-accent rounded p-1 flex flex-col gap-0.5 flex-wrap min-w-[100px] max-w-[200px]"
      >
        {PRESETS.map((p) => {
          const isActive = active === p.name;
          return (
            <button
              key={p.name}
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              type="button"
              onClick={() => apply(p.name, p.opts)}
              onKeyDown={handleKeyDown}
              className={`text-left p-[3px_6px] m-0 border-none rounded font-mono text-[10px] cursor-pointer leading-[14px] ${
                isActive
                  ? "bg-piano-accent text-piano-bg-tertiary"
                  : "bg-transparent text-piano-accent"
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
