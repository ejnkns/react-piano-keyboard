import { Audio, UseMusicNotes } from "../use-piano/use-music-notes";
import { getControls } from "./controls/get-controls";
import type { CSSProperties } from "react";

export type ControlSection =
  | "Presets"
  | "Oscillators"
  | "ADSR Envelope"
  | "Filter"
  | "LFO"
  | "Analog Clip";

const sectionHeader: CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  color: "var(--piano-text-muted)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  fontFamily: "ui-monospace, monospace",
  margin: 0,
  marginBottom: 4,
  width: "100%",
};

export const Controls = ({
  set,
  defaultValues,
  onClose,
  sections,
  envelopeActivity,
  noteRange,
}: {
  set: UseMusicNotes["set"];
  defaultValues?: Partial<Audio.SetOptions>;
  onClose?: () => void;
  sections?: Partial<Record<ControlSection, boolean>>;
  envelopeActivity?: Record<number, { note: string; noteOnAt: number; noteOffAt: number | null; releaseAtStop?: number }>;
  noteRange?: { min: string; max: string };
}) => {
  const { sections: allSections } = getControls({ set, defaultValues, envelopeActivity, noteRange });
  const visibleSections = sections
    ? allSections.filter((s) => sections[s.title as ControlSection] === true)
    : allSections;

  return (
    <div
      style={{
        display: "flex",
        // flexDirection: "column",
        width: "100%",
        gap: 12,
        padding: "12px 16px",
        background: "var(--piano-controls-bg)",
        borderRadius: "8px 8px 0 0",
        boxSizing: "border-box",
      }}
    >
      {visibleSections.map(({ title, controls }) => (
        <div key={title}>
          <p style={sectionHeader}>{title}</p>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {controls.map(({ control }, i) => (
              <div
                key={`${title}-${i}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {control()}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
