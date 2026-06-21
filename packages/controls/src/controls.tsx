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
import type { SetFn } from "./controls-types";
import type { ControlValues } from "@react-piano-keyboard/audio";

export const Controls = ({
  set,
  defaultValues,
  onClose,
  sections,
  envelopeActivity,
  noteRange,
}: {
  set: SetFn;
  defaultValues?: Partial<ControlValues>;
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
    <div className="grid grid-flow-col grid-rows-[173px_173px] gap-2 px-4 py-3 bg-piano-controls-bg rounded-[8px_8px_0_0] box-border overflow-x-auto">
      {visibleSections.map(({ title, group, onToggle, size }) => {
        const hasToggle = onToggle !== undefined;
        const enabled = hasToggle ? (sectionEnabled[title] ?? true) : true;
        const isFull = size === "full";

        return (
          <div
            key={title}
            className={`${isFull ? "row-span-2" : "row-span-1"} flex flex-col min-w-0 min-w-min`}
          >
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
            <div
              className={`flex-1 min-h-0 ${hasToggle && !enabled ? "opacity-40 pointer-events-none" : ""}`}
            >
              {group}
            </div>
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

export type SectionSize = "full" | "half";

function getControls({
  set,
  defaultValues,
  envelopeActivity,
  noteRange,
}: {
  set: SetFn;
  defaultValues?: Partial<ControlValues>;
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
    size: SectionSize;
    onToggle?: (v: boolean) => void;
  }[];
} {
  return {
    sections: [
      {
        title: "Presets" as const,
        size: "full" as const,
        group: (
          <div className="h-full flex items-center justify-center">
            <PresetPicker set={set} />
          </div>
        ),
      },
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
