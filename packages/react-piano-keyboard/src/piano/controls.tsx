import { Audio, UseMusicNotes } from "../use-piano/use-music-notes";
import { getControls } from "./controls/get-controls";

export type ControlSection =
  | "Presets"
  | "Oscillators"
  | "ADSR Envelope"
  | "Filter"
  | "LFO"
  | "Analog Clip";

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
    <div className="flex w-full gap-3 px-4 py-3 bg-piano-controls-bg rounded-[8px_8px_0_0] box-border">
      {visibleSections.map(({ title, controls }) => (
        <div key={title}>
          <p className="text-[9px] font-bold text-piano-text-muted tracking-[0.1em] uppercase font-mono m-0 mb-1 w-full">
            {title}
          </p>
          <div className="flex items-start gap-2 flex-wrap">
            {controls.map(({ control }, i) => (
              <div
                key={`${title}-${i}`}
                className="flex flex-col items-center gap-1"
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
