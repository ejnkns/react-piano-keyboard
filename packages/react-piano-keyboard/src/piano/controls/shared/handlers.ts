import {
  isFilterType,
  isLfoTarget,
  isOscillatorType,
  type LfoTarget,
  type OscillatorConfig,
} from "../../../constants";
import type { Audio, UseMusicNotes } from "../../../use-piano/use-music-notes";

export function getHandlers(set: UseMusicNotes["set"]) {
  const osc = (
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

  return {
    gain: (v: number) => set({ gain: v }),
    attack: (v: number) => set({ attack: v }),
    decay: (v: number) => set({ decay: v }),
    sustain: (v: number) => set({ sustain: v }),
    release: (v: number) => set({ release: v }),
    oscillator: osc,
    filterCutoff: (v: number) => set({ filterCutoff: v }),
    filterResonance: (v: number) => set({ filterResonance: v }),
    filterType: (v: string) => {
      if (isFilterType(v)) set({ filterType: v });
    },
    lfoRate: (v: number) => set({ lfoRate: v }),
    lfoDepth: (v: number) => set({ lfoDepth: v }),
    lfoTarget: (v: string) => {
      if (isLfoTarget(v)) set({ lfoTarget: v as LfoTarget });
    },
    lfoWaveform: (v: string) => {
      if (isOscillatorType(v)) set({ lfoWaveform: v });
    },
    analogClipDrive: (v: number) => set({ analogClipDrive: v }),
    analogClipInput: (v: number) => set({ analogClipInput: v }),
  };
}

export type Handlers = ReturnType<typeof getHandlers>;
