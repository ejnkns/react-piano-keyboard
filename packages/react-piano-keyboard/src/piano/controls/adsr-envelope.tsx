import { type ReactElement } from "react";
import { Slider } from "./slider";
import { AdsrVisualizer } from "./adsr-visualizer";
import type { Handlers } from "./shared/handlers";

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
  };
  handlers: Handlers;
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
}): { title: string; controls: { control: () => ReactElement }[] } {
  return {
    title: "ADSR Envelope",
    controls: [
      {
        control: () => (
          <Slider
            key="gain"
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
        control: () => (
          <Slider
            key="attack"
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
        control: () => (
          <Slider
            key="decay"
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
      {
        control: () => (
          <Slider
            key="sustain"
            name="Sustain"
            defaultValue={defaultValues?.sustain}
            min={0}
            max={1}
            step={0.01}
            onChange={handlers.sustain}
          />
        ),
      },
      {
        control: () => (
          <Slider
            key="release"
            name="Release"
            defaultValue={defaultValues?.release}
            min={0.01}
            max={5}
            step={0.01}
            unit="s"
            onChange={handlers.release}
          />
        ),
      },
      {
        control: () => (
          <AdsrVisualizer
            key="adsr-viz"
            gain={defaultValues?.gain ?? 1}
            attack={defaultValues?.attack ?? 0.01}
            decay={defaultValues?.decay ?? 0.01}
            sustain={defaultValues?.sustain ?? 0.5}
            release={defaultValues?.release ?? 0.4}
            activity={envelopeActivity}
            noteRange={noteRange}
          />
        ),
      },
    ],
  };
}
