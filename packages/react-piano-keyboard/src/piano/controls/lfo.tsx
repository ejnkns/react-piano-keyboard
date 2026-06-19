import { useState, useEffect, type ReactElement } from "react";
import {
  isOscillatorType,
  LFO_TARGETS,
  isLfoTarget,
  type LfoTarget,
} from "../../constants";
import { Slider } from "./slider";
import { LfoVisualizer } from "./lfo-visualizer";
import type { Handlers } from "./shared/handlers";

const LFO_WAVEFORMS = ["sine", "triangle", "sawtooth", "square"];

function LfoWaveformPicker({
  defaultValue,
  onChange,
}: {
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [selected, setSelected] = useState<string>(() =>
    LFO_WAVEFORMS.includes(defaultValue ?? "") ? defaultValue! : "sine",
  );

  useEffect(() => {
    if (
      defaultValue !== undefined &&
      LFO_WAVEFORMS.includes(defaultValue) &&
      defaultValue !== selected
    ) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="flex flex-col items-center gap-1.5 p-2">
      <span className="text-[10px] font-semibold text-piano-text-muted tracking-[0.05em] uppercase font-mono">
        LFO Wave
      </span>
      <div className="bg-piano-bg-tertiary border border-piano-accent rounded p-1">
        {LFO_WAVEFORMS.map((wf) => {
          const isSelected = selected === wf;
          return (
            <button
              key={wf}
              type="button"
              onClick={() => {
                setSelected(wf);
                onChange?.(wf);
              }}
              className={`block w-full p-[3px_6px] m-0 border-none rounded font-mono text-[10px] text-left cursor-pointer leading-[14px] ${
                isSelected ? "bg-piano-accent text-piano-bg-tertiary" : "bg-transparent text-piano-accent"
              }`}
            >
              {wf}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LfoTargetPicker({
  defaultValue,
  onChange,
}: {
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [selected, setSelected] = useState<LfoTarget>(() =>
    isLfoTarget(defaultValue) ? defaultValue : "none",
  );

  useEffect(() => {
    if (
      defaultValue !== undefined &&
      isLfoTarget(defaultValue) &&
      defaultValue !== selected
    ) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="flex flex-col items-center gap-1.5 p-2">
      <span className="text-[10px] font-semibold text-piano-text-muted tracking-[0.05em] uppercase font-mono">
        LFO Target
      </span>
      <div className="bg-piano-bg-tertiary border border-piano-accent rounded p-1">
        {LFO_TARGETS.map((target) => {
          const isSelected = selected === target;
          return (
            <button
              key={target}
              type="button"
              onClick={() => {
                setSelected(target);
                onChange?.(target);
              }}
              className={`block w-full p-[3px_6px] m-0 border-none rounded font-mono text-[10px] text-left cursor-pointer leading-[14px] ${
                isSelected ? "bg-piano-accent text-piano-bg-tertiary" : "bg-transparent text-piano-accent"
              }`}
            >
              {target === "none" ? "Off" : target}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function getLfoSection({
  defaultValues,
  handlers,
}: {
  defaultValues?: {
    lfoRate?: number;
    lfoDepth?: number;
    lfoTarget?: string;
    lfoWaveform?: string;
  };
  handlers: Handlers;
}): { title: string; controls: { control: () => ReactElement }[] } {
  return {
    title: "LFO",
    controls: [
      {
        control: () => (
          <Slider
            key="lfo-rate"
            name="LFO Rate"
            defaultValue={defaultValues?.lfoRate}
            min={0.1}
            max={20}
            step={0.1}
            unit="Hz"
            onChange={handlers.lfoRate}
          />
        ),
      },
      {
        control: () => (
          <Slider
            key="lfo-depth"
            name="LFO Depth"
            defaultValue={defaultValues?.lfoDepth}
            min={0}
            max={1}
            step={0.01}
            onChange={handlers.lfoDepth}
          />
        ),
      },
      {
        control: () => (
          <LfoTargetPicker
            key="lfo-target"
            defaultValue={defaultValues?.lfoTarget}
            onChange={handlers.lfoTarget}
          />
        ),
      },
      {
        control: () => (
          <LfoWaveformPicker
            key="lfo-wave"
            defaultValue={defaultValues?.lfoWaveform}
            onChange={handlers.lfoWaveform}
          />
        ),
      },
      {
        control: () => (
          <LfoVisualizer
            key="lfo-viz"
            lfoRate={defaultValues?.lfoRate ?? 4}
            lfoDepth={defaultValues?.lfoDepth ?? 0}
            lfoWaveform={(defaultValues?.lfoWaveform ?? "sine") as OscillatorType}
            lfoTarget={(defaultValues?.lfoTarget ?? "none") as LfoTarget}
          />
        ),
      },
    ],
  };
}
