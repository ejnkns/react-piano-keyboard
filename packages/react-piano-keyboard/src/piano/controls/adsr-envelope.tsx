import { Slider } from "./shared/slider";
import { AdsrVisualizer } from "./adsr-envelope/adsr-visualizer";
import type { UseMusicNotes } from "../../use-piano/use-music-notes";

export type AdsrHandlers = {
  gain: (v: number) => void;
  attack: (v: number) => void;
  decay: (v: number) => void;
  sustain: (v: number) => void;
  release: (v: number) => void;
  adsrEnabled: (v: boolean) => void;
};

export function getAdsrHandlers(set: UseMusicNotes["set"]): AdsrHandlers {
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
    onToggle: handlers.adsrEnabled,
    group: (
      <div className="bg-piano-bg-tertiary border border-piano-accent rounded p-2">
        <div className="flex items-start gap-2 flex-wrap justify-between">
          <Slider
            name="Gain"
            defaultValue={defaultValues?.gain}
            min={0}
            max={1}
            step={0.05}
            onChange={handlers.gain}
          />
          <Slider
            name="Attack"
            defaultValue={defaultValues?.attack}
            min={0.01}
            max={2}
            step={0.01}
            unit="s"
            onChange={handlers.attack}
          />
          <Slider
            name="Decay"
            defaultValue={defaultValues?.decay}
            min={0.01}
            max={2}
            step={0.01}
            unit="s"
            onChange={handlers.decay}
          />
          <Slider
            name="Sustain"
            defaultValue={defaultValues?.sustain}
            min={0}
            max={1}
            step={0.01}
            onChange={handlers.sustain}
          />
          <Slider
            name="Release"
            defaultValue={defaultValues?.release}
            min={0.01}
            max={5}
            step={0.01}
            unit="s"
            onChange={handlers.release}
          />
        </div>
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
    ),
  };
}
