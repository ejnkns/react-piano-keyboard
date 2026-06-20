import { useState, useEffect } from "react";
import { isOscillatorType, type OscillatorConfig } from "../../constants";
import { Slider } from "./shared/slider";
import { Picker, type PickerOption } from "./shared/picker";
import { Icon } from "./shared/icon";
import type { Audio, UseMusicNotes } from "../../use-piano/use-music-notes";

export type OscillatorHandlers = {
  oscillator: (
    index: number,
    field: keyof OscillatorConfig,
    value: number | string,
  ) => void;
};

export function getOscillatorHandlers(
  set: UseMusicNotes["set"],
): OscillatorHandlers {
  const oscillator = (
    index: number,
    field: keyof OscillatorConfig,
    value: number | string,
  ) => {
    set((prev: Audio.SetOptions) => {
      const oscs = [...(prev.oscillators ?? [])];
      if (!oscs[index]) {
        oscs[index] = {
          waveform: "sine",
          gain: 0.5,
          detune: 0,
          octave: 0,
          pan: 0,
        };
      }
      oscs[index] = { ...oscs[index], [field]: value };
      return { oscillators: oscs };
    });
  };

  return { oscillator };
}

const WAVEFORM_OPTIONS: PickerOption[] = [
  { value: "sine" },
  { value: "triangle" },
  { value: "sawtooth" },
  { value: "square" },
];

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
  handlers: OscillatorHandlers;
}) {
  const [waveform, setWaveform] = useState<string>(() =>
    isOscillatorType(defaults?.waveform) ? defaults!.waveform : "sine",
  );

  useEffect(() => {
    if (
      defaults?.waveform !== undefined &&
      isOscillatorType(defaults.waveform) &&
      defaults.waveform !== waveform
    ) {
      setWaveform(defaults.waveform);
    }
  }, [defaults?.waveform]);

  return (
    <div className="flex items-start gap-2">
      <Picker
        label={label}
        options={WAVEFORM_OPTIONS}
        value={waveform}
        onChange={(v) => {
          setWaveform(v);
          handlers.oscillator(index, "waveform", v);
        }}
      >
        {(option) => (
          <>
            <Icon waveform={option.value} />
            {option.value}
          </>
        )}
      </Picker>
      <Slider
        name="Gain"
        defaultValue={defaults?.gain}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => handlers.oscillator(index, "gain", v)}
      />
      <Slider
        name="Detune"
        defaultValue={defaults?.detune}
        min={-100}
        max={100}
        step={1}
        unit="ct"
        onChange={(v) => handlers.oscillator(index, "detune", v)}
      />
      <Slider
        name="Octave"
        defaultValue={defaults?.octave}
        min={-2}
        max={2}
        step={1}
        onChange={(v) => handlers.oscillator(index, "octave", v)}
      />
      <Slider
        name="Pan"
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
  defaultValues?: {
    oscillators?: OscillatorConfig[];
    oscillatorCount?: number;
  };
  handlers: OscillatorHandlers;
}) {
  const osc1 = defaultValues?.oscillators?.[0];
  const osc2 = defaultValues?.oscillators?.[1];
  const oscCount = defaultValues?.oscillatorCount ?? 2;

  return {
    title: "Oscillators" as const,
    group: (
      <div className="bg-piano-bg-tertiary border border-piano-accent rounded p-2">
        <div className="flex items-start flex-col gap-2">
          <OscillatorControls
            index={0}
            label="Osc 1"
            defaults={osc1}
            handlers={handlers}
          />
          {oscCount === 2 && (
            <>
              <Separator />
              <OscillatorControls
                index={1}
                label="Osc 2"
                defaults={osc2}
                handlers={handlers}
              />
            </>
          )}
        </div>
      </div>
    ),
  };
}
