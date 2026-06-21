import type { LfoTarget, OscillatorConfig, Waveforms } from "./defaults";

export namespace Audio {
  export type FrequencyState = {
    oscillators: Waveforms.Oscillator[];
    gain: number;
    hz: number;
    playing: boolean;
    touched: boolean;
  };

  export type SetOptions = {
    oscillatorCount?: 1 | 2;
    oscillators?: OscillatorConfig[];
    gain?: number;
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    filterCutoff?: number;
    filterResonance?: number;
    filterType?: BiquadFilterType;
    lfoRate?: number;
    lfoDepth?: number;
    lfoTarget?: LfoTarget;
    lfoWaveform?: OscillatorType;
    analogClipDrive?: number;
    analogClipInput?: number;
    adsrEnabled?: boolean;
    filterEnabled?: boolean;
    lfoEnabled?: boolean;
    analogClipEnabled?: boolean;
  };
}

export type UseMusicNotesOptions = Audio.SetOptions & {
  initialFrequencyStates?: Audio.FrequencyState[];
  audioContext?: AudioContext;
  analyserNode?: AnalyserNode;
};
