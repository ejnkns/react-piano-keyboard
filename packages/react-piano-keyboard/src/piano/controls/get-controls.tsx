import { useState } from "react";
import "../../styles.css";
import { Audio, UseMusicNotes } from "../../use-piano/use-music-notes";
import { isOscillatorType, Waveforms } from "../../constants";
import { Knob } from "./knob";

export function getControls({
  set,
  defaultValues,
}: {
  set: UseMusicNotes["set"];
  defaultValues?: Partial<Audio.SetOptions>;
}) {
  const handlers = getHandlers(set);

  return {
    knobs: [
      {
        name: "Gain",
        control: () => (
          <Knob
            name="Gain"
            defaultValue={defaultValues?.gain}
            min={0}
            max={1}
            step={0.05}
            onChange={handlers.gain}
          />
        ),
      },
      {
        name: "Attack",
        control: () => (
          <Knob
            name="Attack"
            defaultValue={defaultValues?.attack}
            min={0.01}
            max={2}
            step={0.01}
            unit="s"
            onChange={handlers.attack}
          />
        ),
      },
      {
        name: "Decay",
        control: () => (
          <Knob
            name="Decay"
            defaultValue={defaultValues?.decay}
            min={0.01}
            max={2}
            step={0.01}
            unit="s"
            onChange={handlers.decay}
          />
        ),
      },
    ],
    buttonGroups: [
      {
        name: "Oscillator",
        control: () => (
          <WaveformPicker
            defaultValue={defaultValues?.oscillator}
            onChange={handlers.oscillator}
          />
        ),
      },
    ],
  };
}

function getHandlers(set: UseMusicNotes["set"]) {
  const handleSetOscillator = (value: string) => {
    if (isOscillatorType(value)) set({ oscillator: value });
  };

  const handleSetAttack = (value: number) => {
    set({ attack: value });
  };

  const handleSetDecay = (value: number) => {
    set({ decay: value });
  };

  const handleSetGain = (value: number) => {
    set({ gain: value });
  };

  return {
    gain: handleSetGain,
    oscillator: handleSetOscillator,
    attack: handleSetAttack,
    decay: handleSetDecay,
  };
}

export type SelectOptions<T extends string> = {
  id: number | string;
  name: T;
  icon?: string;
};

export const displayOscillators = [
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
  defaultValue,
  onChange,
}: {
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [selected, setSelected] = useState<Waveforms.Oscillator>(() =>
    isOscillatorType(defaultValue) ? defaultValue : "sine",
  );

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
          Wave
        </span>
        <div
          style={{
            background: "var(--piano-bg-tertiary)",
            border: "1px solid var(--piano-accent)",
            borderRadius: 4,
            padding: 4,
            boxSizing: "border-box",
          }}
        >
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
                className={"wave-btn" + (isSelected ? " selected" : "")}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "3px 6px",
                  margin: 0,
                  border: "none",
                  borderRadius: 2,
                  background: isSelected
                    ? "var(--piano-accent)"
                    : "transparent",
                  color: isSelected
                    ? "var(--piano-bg-tertiary)"
                    : "var(--piano-accent)",
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 10,
                  textAlign: "left",
                  cursor: "pointer",
                  lineHeight: "14px",
                  boxSizing: "border-box",
                }}
              >
                <svg
                  viewBox="0 0 14 10"
                  width={14}
                  height={10}
                  style={{
                    verticalAlign: "middle",
                    marginRight: 2,
                    display: "inline",
                    overflow: "hidden",
                  }}
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
