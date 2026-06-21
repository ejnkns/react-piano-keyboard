import { Slider } from "../slider";
import { AdsrVisualizer } from "../adsr-visualizer";
import type { SetFn } from "../controls-types";

export type AdsrHandlers = {
  gain: (v: number) => void;
  attack: (v: number) => void;
  decay: (v: number) => void;
  sustain: (v: number) => void;
  release: (v: number) => void;
  adsrEnabled: (v: boolean) => void;
};

export function getAdsrHandlers(set: SetFn): AdsrHandlers {
  return {
    gain: (v: number) => set({ gain: v }),
    attack: (v: number) => set({ attack: v }),
    decay: (v: number) => set({ decay: v }),
    sustain: (v: number) => set({ sustain: v }),
    release: (v: number) => set({ release: v }),
    adsrEnabled: (v: boolean) => set({ adsrEnabled: v }),
  };
}

export function getAdsrEnvelopeSection({
  defaultValues,
  handlers,
  envelopeActivity,
  noteRange,
}: {
  defaultValues?: {
    gain?: number;
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    adsrEnabled?: boolean;
  };
  handlers: AdsrHandlers;
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
}) {
  return {
    title: "ADSR Envelope" as const,
    size: "full" as const,
    onToggle: handlers.adsrEnabled,
    group: (
      <div
        className="bg-piano-bg-tertiary border border-piano-accent rounded p-2 h-full grid grid-cols-5 gap-4 items-center"
        style={{ width: "max-content" }}
      >
        {/* Row 1, Col 1: Empty */}
        <div />

        {/* Row 1, Col 2: Attack */}
        <Slider
          name="Attack"
          defaultValue={defaultValues?.attack}
          min={0.01}
          max={2}
          step={0.01}
          unit="s"
          onChange={handlers.attack}
        />

        {/* Row 1, Col 3: Decay */}
        <Slider
          name="Decay"
          defaultValue={defaultValues?.decay}
          min={0.01}
          max={2}
          step={0.01}
          unit="s"
          onChange={handlers.decay}
        />

        {/* Row 1, Col 4: Sustain */}
        <Slider
          name="Sustain"
          defaultValue={defaultValues?.sustain}
          min={0}
          max={1}
          step={0.01}
          onChange={handlers.sustain}
        />

        {/* Row 1, Col 5: Release */}
        <Slider
          name="Release"
          defaultValue={defaultValues?.release}
          min={0.01}
          max={5}
          step={0.01}
          unit="s"
          onChange={handlers.release}
        />

        {/* Row 2, Col 1: Gain */}
        <Slider
          name="Gain"
          defaultValue={defaultValues?.gain}
          min={0}
          max={1}
          step={0.05}
          onChange={handlers.gain}
        />

        {/* Row 2, Col 2-5: Visualizer (4 cols wide) */}
        <div className="col-span-4 flex justify-center items-center h-full w-full">
          <AdsrVisualizer
            gain={defaultValues?.gain ?? 1}
            attack={defaultValues?.attack ?? 0.01}
            decay={defaultValues?.decay ?? 0.01}
            sustain={defaultValues?.sustain ?? 0.5}
            release={defaultValues?.release ?? 0.4}
            activity={envelopeActivity}
            noteRange={noteRange}
          />
        </div>
      </div>
    ),
  };
}
