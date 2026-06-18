import { useState } from "react";
import type { Audio, UseMusicNotes } from "../../use-piano/use-music-notes";
import { PRESETS } from "./presets";

export const PresetPicker = ({
  set,
}: {
  set: UseMusicNotes["set"];
}) => {
  const [active, setActive] = useState("Default");

  const apply = (name: string, opts: Partial<Audio.SetOptions>) => {
    setActive(name);
    set(opts);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "4px 8px" }}>
      <span style={{
        fontSize: 10, fontWeight: 600, color: "var(--piano-text-muted)",
        letterSpacing: "0.05em", textTransform: "uppercase",
        fontFamily: "ui-monospace, monospace",
      }}>
        Presets
      </span>
      <div style={{
        background: "var(--piano-bg-tertiary)", border: "1px solid var(--piano-accent)",
        borderRadius: 4, padding: 4,
        display: "flex", gap: 2, flexWrap: "wrap",
        maxWidth: 200,
      }}>
        {PRESETS.map((p) => {
          const isActive = active === p.name;
          return (
            <button key={p.name} type="button"
              onClick={() => apply(p.name, p.opts)}
              style={{
                padding: "3px 6px", margin: 0, border: "none", borderRadius: 2,
                background: isActive ? "var(--piano-accent)" : "transparent",
                color: isActive ? "var(--piano-bg-tertiary)" : "var(--piano-accent)",
                fontFamily: "ui-monospace, monospace", fontSize: 10,
                cursor: "pointer", lineHeight: "14px",
              }}>
              {p.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
