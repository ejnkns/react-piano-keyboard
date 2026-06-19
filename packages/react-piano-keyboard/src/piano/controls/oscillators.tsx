import { useState, useEffect, type ReactElement } from "react";
import {
  isOscillatorType,
  Waveforms,
  type OscillatorConfig,
} from "../../constants";
import { Slider } from "./slider";
import type { Handlers } from "./shared/handlers";

type SelectOptions<T extends string> = {
  id: number | string;
  name: T;
  icon?: string;
};

const displayOscillators = [
  { id: 1, name: "sine" as const },
  { id: 2, name: "triangle" as const },
  { id: 3, name: "sawtooth" as const },
  { id: 4, name: "square" as const },
] satisfies [
  SelectOptions<"sine" | "triangle" | "sawtooth" | "square">,
  ...SelectOptions<"sine" | "triangle" | "sawtooth" | "square">[],
];

const WAVEFORMS = displayOscillators.map((o) => o.name);

const WAVE_ICONS: Record<string, string> = {
  sine: "M0,5 C3,0 4,0 7,5 C10,10 11,10 14,5",
  triangle: "M0,9 L3.5,1 L7,9 L10.5,1 L14,9",
  sawtooth: "M0,1 L7,9 L7,1 L14,9 L14,1",
  square: "M0,1 L3.5,1 L3.5,9 L7,9 L7,1 L10.5,1 L10.5,9 L14,9 L14,1",
};

function WaveformPicker({
  label = "Wave",
  defaultValue,
  onChange,
}: {
  label?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [selected, setSelected] = useState<Waveforms.Oscillator>(() =>
    isOscillatorType(defaultValue) ? defaultValue : "sine",
  );

  useEffect(() => {
    if (
      defaultValue !== undefined &&
      isOscillatorType(defaultValue) &&
      defaultValue !== selected
    ) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  return (
    <>
      <style>{`
@keyframes scrollWave { from { transform: translateX(0); } to { transform: translateX(-14px); } }
.wave-btn { font-weight: 400; }
.wave-btn:hover { font-weight: 700; }
.wave-btn.selected { font-weight: 700; }
.wave-btn .wave-scroll { animation: scrollWave 1s linear infinite; animation-play-state: paused; }
.wave-btn:hover .wave-scroll, .wave-btn.selected:hover .wave-scroll { animation-play-state: running; }
`}</style>
      <div className="flex flex-col items-center gap-1.5 p-2">
        <span className="text-[10px] font-semibold text-piano-text-muted tracking-[0.05em] uppercase font-mono">
          {label}
        </span>
        <div className="bg-piano-bg-tertiary border border-piano-accent rounded p-1 box-border">
          {WAVEFORMS.map((waveform) => {
            const isSelected = selected === waveform;
            return (
              <button
                key={waveform}
                type="button"
                onClick={() => {
                  setSelected(waveform);
                  onChange?.(waveform);
                }}
                className={`wave-btn block w-full p-[3px_6px] m-0 border-none rounded font-mono text-[10px] text-left cursor-pointer leading-[14px] box-border ${
                  isSelected ? "selected bg-piano-accent text-piano-bg-tertiary" : "bg-transparent text-piano-accent"
                }`}
              >
                <svg
                  viewBox="0 0 14 10"
                  width={14}
                  height={10}
                  className="align-middle mr-0.5 inline overflow-hidden"
                >
                  <g className="wave-scroll">
                    <path
                      d={WAVE_ICONS[waveform] ?? ""}
                      fill="none"
                      stroke={
                        isSelected
                          ? "var(--piano-bg-tertiary)"
                          : "var(--piano-accent)"
                      }
                      strokeWidth={1.3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={WAVE_ICONS[waveform] ?? ""}
                      fill="none"
                      stroke={
                        isSelected
                          ? "var(--piano-bg-tertiary)"
                          : "var(--piano-accent)"
                      }
                      strokeWidth={1.3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      transform="translate(14, 0)"
                    />
                  </g>
                </svg>
                {waveform}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Separator() {
  return <div className="w-px self-stretch bg-piano-border mx-1" />;
}

function OscillatorControls({
  index,
  label,
  defaults,
  handlers,
}: {
  index: number;
  label: string;
  defaults?: OscillatorConfig;
  handlers: Handlers;
}) {
  return (
    <div key={`osc-group-${index}`} className="flex items-start gap-2">
      <WaveformPicker
        key={`osc-${index}-wave`}
        label={`${label}`}
        defaultValue={defaults?.waveform}
        onChange={(v) => handlers.oscillator(index, "waveform", v)}
      />
      <Slider
        key={`osc-${index}-gain`}
        name={`Gain`}
        defaultValue={defaults?.gain}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => handlers.oscillator(index, "gain", v)}
      />
      <Slider
        key={`osc-${index}-detune`}
        name={`Detune`}
        defaultValue={defaults?.detune}
        min={-100}
        max={100}
        step={1}
        unit="ct"
        onChange={(v) => handlers.oscillator(index, "detune", v)}
      />
      <Slider
        key={`osc-${index}-octave`}
        name={`Octave`}
        defaultValue={defaults?.octave}
        min={-2}
        max={2}
        step={1}
        onChange={(v) => handlers.oscillator(index, "octave", v)}
      />
      <Slider
        key={`osc-${index}-pan`}
        name={`Pan`}
        defaultValue={defaults?.pan}
        min={-1}
        max={1}
        step={0.01}
        onChange={(v) => handlers.oscillator(index, "pan", v)}
      />
    </div>
  );
}

export function getOscillatorSection({
  defaultValues,
  handlers,
}: {
  defaultValues?: { oscillators?: OscillatorConfig[]; oscillatorCount?: number };
  handlers: Handlers;
}): { title: string; controls: { control: () => ReactElement }[] } {
  const osc1 = defaultValues?.oscillators?.[0];
  const osc2 = defaultValues?.oscillators?.[1];
  const oscCount = defaultValues?.oscillatorCount ?? 2;

  const controls: { control: () => ReactElement }[] = [
    {
      control: () => (
        <OscillatorControls
          index={0}
          label="Osc 1"
          defaults={osc1}
          handlers={handlers}
        />
      ),
    },
  ];

  if (oscCount === 2) {
    controls.push({ control: () => <Separator /> });
    controls.push({
      control: () => (
        <OscillatorControls
          index={1}
          label="Osc 2"
          defaults={osc2}
          handlers={handlers}
        />
      ),
    });
  }

  return { title: "Oscillators", controls };
}
