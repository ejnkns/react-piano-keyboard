import { useState } from "react";
import { PresetPicker } from "./controls/preset-picker";
import { Toggle } from "./controls/shared/toggle";
import {
  getOscillatorSection,
  getOscillatorHandlers,
} from "./controls/oscillators";
import {
  getAdsrEnvelopeSection,
  getAdsrHandlers,
} from "./controls/adsr-envelope";
import { getFilterSection, getFilterHandlers } from "./controls/filter";
import { getLfoSection, getLfoHandlers } from "./controls/lfo";
import {
  getAnalogClipSection,
  getAnalogClipHandlers,
} from "./controls/analog-clip";
import type { Audio, UseMusicNotes } from "../use-piano/use-music-notes";

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
  envelopeActivity?: Record<
    number,
    {
      note: string;
      noteOnAt: number;
      noteOffAt: number | null;
      releaseAtStop?: number;
    }
  >;
  noteRange?: { min: string; max: string };
}) => {
  const { sections: allSections } = getControls({
    set,
    defaultValues,
    envelopeActivity,
    noteRange,
  });
  const visibleSections = sections
    ? allSections.filter((s) => sections[s.title] === true)
    : allSections;

  const [sectionEnabled, setSectionEnabled] = useState<Record<string, boolean>>(
    {},
  );

  return (
    <div className="flex w-full gap-2 px-4 py-3 bg-piano-controls-bg rounded-[8px_8px_0_0] box-border">
      {visibleSections.map(({ title, group, onToggle }) => {
        const hasToggle = onToggle !== undefined;
        const enabled = hasToggle ? (sectionEnabled[title] ?? true) : true;

        return (
          <div key={title}>
            <div className="flex items-center justify-between w-full mb-1">
              <p className="text-[9px] font-bold text-piano-text-muted tracking-[0.1em] uppercase font-mono m-0">
                {title}
              </p>
              {hasToggle && (
                <Toggle
                  checked={enabled}
                  onChange={(v) => {
                    setSectionEnabled((prev) => ({ ...prev, [title]: v }));
                    onToggle(v);
                  }}
                />
              )}
            </div>
            {hasToggle ? (
              <div className={!enabled ? "opacity-40 pointer-events-none" : ""}>
                {group}
              </div>
            ) : (
              group
            )}
          </div>
        );
      })}
    </div>
  );
};

const CONTROL_SECTION = [
  "Presets",
  "Oscillators",
  "ADSR Envelope",
  "Filter",
  "LFO",
  "Analog Clip",
] as const;

export type ControlSection = (typeof CONTROL_SECTION)[number];

function getControls({
  set,
  defaultValues,
  envelopeActivity,
  noteRange,
}: {
  set: UseMusicNotes["set"];
  defaultValues?: Partial<Audio.SetOptions>;
  envelopeActivity?: Record<
    number,
    {
      note: string;
      noteOnAt: number;
      noteOffAt: number | null;
      releaseAtStop?: number;
    }
  >;
  noteRange?: { min: string; max: string };
}): {
  sections: {
    title: ControlSection;
    group: React.ReactElement;
    onToggle?: (v: boolean) => void;
  }[];
} {
  return {
    sections: [
      { title: "Presets" as const, group: <PresetPicker set={set} /> },
      getOscillatorSection({
        defaultValues,
        handlers: getOscillatorHandlers(set),
      }),
      getAdsrEnvelopeSection({
        defaultValues,
        handlers: getAdsrHandlers(set),
        envelopeActivity,
        noteRange,
      }),
      getFilterSection({ defaultValues, handlers: getFilterHandlers(set) }),
      getLfoSection({ defaultValues, handlers: getLfoHandlers(set) }),
      getAnalogClipSection({
        defaultValues,
        handlers: getAnalogClipHandlers(set),
      }),
    ],
  };
}
