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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: 8,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--piano-text-muted)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        LFO Wave
      </span>
      <div
        style={{
          background: "var(--piano-bg-tertiary)",
          border: "1px solid var(--piano-accent)",
          borderRadius: 4,
          padding: 4,
        }}
      >
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
              style={{
                display: "block",
                width: "100%",
                padding: "3px 6px",
                margin: 0,
                border: "none",
                borderRadius: 2,
                background: isSelected ? "var(--piano-accent)" : "transparent",
                color: isSelected
                  ? "var(--piano-bg-tertiary)"
                  : "var(--piano-accent)",
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                textAlign: "left",
                cursor: "pointer",
                lineHeight: "14px",
              }}
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: 8,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--piano-text-muted)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        LFO Target
      </span>
      <div
        style={{
          background: "var(--piano-bg-tertiary)",
          border: "1px solid var(--piano-accent)",
          borderRadius: 4,
          padding: 4,
        }}
      >
        {LFO_TARGETS.map((target) => {
          const isSelected = selected === target;
          return (
            <button
              key={target}
              type="button"
              className={isSelected ? "selected" : ""}
              onClick={() => {
                setSelected(target);
                onChange?.(target);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "3px 6px",
                margin: 0,
                border: "none",
                borderRadius: 2,
                background: isSelected ? "var(--piano-accent)" : "transparent",
                color: isSelected
                  ? "var(--piano-bg-tertiary)"
                  : "var(--piano-accent)",
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                textAlign: "left",
                cursor: "pointer",
                lineHeight: "14px",
              }}
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
