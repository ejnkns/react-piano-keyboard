import { useState, useEffect } from "react";
import {
  isOscillatorType,
  LFO_TARGETS,
  isLfoTarget,
  type LfoTarget,
} from "@react-piano-keyboard/audio/defaults";
import { Slider } from "./shared/slider";
import { WavePicker } from "./shared/wave-picker";
import { Picker, type PickerOption } from "./shared/picker";
import { LfoVisualizer } from "./lfo/lfo-visualizer";
import type { SetFn } from "../controls-types";

export type LfoHandlers = {
  lfoRate: (v: number) => void;
  lfoDepth: (v: number) => void;
  lfoTarget: (v: string) => void;
  lfoWaveform: (v: string) => void;
  lfoEnabled: (v: boolean) => void;
};

export function getLfoHandlers(set: SetFn): LfoHandlers {
  return {
    lfoRate: (v: number) => set({ lfoRate: v }),
    lfoDepth: (v: number) => set({ lfoDepth: v }),
    lfoTarget: (v: string) => {
      if (isLfoTarget(v)) set({ lfoTarget: v as LfoTarget });
    },
    lfoWaveform: (v: string) => {
      if (isOscillatorType(v)) set({ lfoWaveform: v });
    },
    lfoEnabled: (v: boolean) => set({ lfoEnabled: v }),
  };
}

const LFO_WAVE_OPTIONS: PickerOption[] = [
  { value: "sine" },
  { value: "triangle" },
  { value: "sawtooth" },
  { value: "square" },
];

const LFO_TARGET_OPTIONS: PickerOption[] = LFO_TARGETS.map((t) => ({
  value: t,
  label: t === "none" ? "Off" : t,
}));

function LfoGroup({
  defaultValues,
  handlers,
}: {
  defaultValues?: { lfoRate?: number; lfoDepth?: number; lfoTarget?: string; lfoWaveform?: string };
  handlers: LfoHandlers;
}) {
  const [lfoWave, setLfoWave] = useState<string>(() =>
    isOscillatorType(defaultValues?.lfoWaveform)
      ? defaultValues!.lfoWaveform
      : "sine",
  );

  const [lfoTarget, setLfoTarget] = useState<LfoTarget>(() =>
    isLfoTarget(defaultValues?.lfoTarget)
      ? (defaultValues!.lfoTarget as LfoTarget)
      : "none",
  );

  useEffect(() => {
    if (
      defaultValues?.lfoWaveform !== undefined &&
      isOscillatorType(defaultValues.lfoWaveform) &&
      defaultValues.lfoWaveform !== lfoWave
    ) {
      setLfoWave(defaultValues.lfoWaveform);
    }
  }, [defaultValues?.lfoWaveform]);

  useEffect(() => {
    if (
      defaultValues?.lfoTarget !== undefined &&
      isLfoTarget(defaultValues.lfoTarget) &&
      defaultValues.lfoTarget !== lfoTarget
    ) {
      setLfoTarget(defaultValues.lfoTarget as LfoTarget);
    }
  }, [defaultValues?.lfoTarget]);

  return (
    <div className="bg-piano-bg-tertiary border border-piano-accent rounded p-2 h-full">
      <div className="flex items-start gap-2">
        <Slider
          name="LFO Rate"
          defaultValue={defaultValues?.lfoRate}
          min={0.1}
          max={20}
          step={0.1}
          unit="Hz"
          onChange={handlers.lfoRate}
        />
        <Slider
          name="LFO Depth"
          defaultValue={defaultValues?.lfoDepth}
          min={0}
          max={1}
          step={0.01}
          onChange={handlers.lfoDepth}
        />
        <Picker
          label="LFO Target"
          options={LFO_TARGET_OPTIONS}
          value={lfoTarget}
          onChange={(v) => {
            setLfoTarget(v as LfoTarget);
            handlers.lfoTarget(v);
          }}
        />
        <WavePicker
          label="LFO Wave"
          options={LFO_WAVE_OPTIONS}
          value={lfoWave}
          onChange={(v) => {
            setLfoWave(v);
            handlers.lfoWaveform(v);
          }}
        />
        <LfoVisualizer
          lfoRate={defaultValues?.lfoRate ?? 4}
          lfoDepth={defaultValues?.lfoDepth ?? 0}
          lfoWaveform={lfoWave as OscillatorType}
          lfoTarget={lfoTarget}
        />
      </div>
    </div>
  );
}

export function getLfoSection({
  defaultValues,
  handlers,
}: {
  defaultValues?: { lfoRate?: number; lfoDepth?: number; lfoTarget?: string; lfoWaveform?: string; lfoEnabled?: boolean };
  handlers: LfoHandlers;
}) {
  return {
    title: "LFO" as const,
    size: "half" as const,
    onToggle: handlers.lfoEnabled,
    group: <LfoGroup defaultValues={defaultValues} handlers={handlers} />,
  };
}
