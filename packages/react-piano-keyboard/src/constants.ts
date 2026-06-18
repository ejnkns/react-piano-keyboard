export const A4 = 440.0;
export const A4_INDEX = 57;
export const PITCH_CLASSES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;
export const WHITE_PITCH_CLASSES = ["C", "D", "E", "F", "G", "A", "B"] as const;
export const OCTAVE_LENGTH = PITCH_CLASSES.length;
export const DEFAULT_OCTAVE = 4;
export const MAX_OCTAVE = 10;

export const SMOOTH_IN_INTERVAL = 0.2;
export const SMOOTH_OUT_INTERVAL = 0.4;
export const MAX_GAIN = 0.5;

export const OSCILLATORS = [
  "sine",
  "sawtooth",
  "square",
  "triangle",
] satisfies OscillatorType[];

export namespace Waveforms {
  export type Oscillator = (typeof OSCILLATORS)[number];
}

export const isOscillatorType = (value: unknown): value is Waveforms.Oscillator =>
  typeof value === "string" && OSCILLATORS.includes(value as Waveforms.Oscillator);

export type OscillatorConfig = {
  waveform: Waveforms.Oscillator;
  gain: number;
  detune: number;
  octave: number;
  pan: number;
};

export const DEFAULT_OSCILLATOR_COUNT = 2;

export const DEFAULT_OSCILLATOR_CONFIG: OscillatorConfig = {
  waveform: "sine",
  gain: 0.5,
  detune: 0,
  octave: 0,
  pan: 0,
};

// Filter
export const DEFAULT_FILTER_CUTOFF = 20000;
export const DEFAULT_FILTER_RESONANCE = 0.1;
export const DEFAULT_FILTER_TYPE: BiquadFilterType = "lowpass";

export const FILTER_TYPES: BiquadFilterType[] = [
  "lowpass", "highpass", "bandpass", "notch",
  "lowshelf", "highshelf", "peaking", "allpass",
];

export const isFilterType = (value: unknown): value is BiquadFilterType =>
  typeof value === "string" && FILTER_TYPES.includes(value as BiquadFilterType);

// Envelope
export const DEFAULT_SUSTAIN = 0.5;
export const DEFAULT_RELEASE = 0.4;

// Analog Clip
export const DEFAULT_ANALOG_CLIP_DRIVE = 1.5;
export const DEFAULT_ANALOG_CLIP_INPUT = 0.5;
export const ANALOG_CLIP_OVERSAMPLE: OverSampleType = '4x';

// LFO
export const DEFAULT_LFO_RATE = 4;
export const DEFAULT_LFO_DEPTH = 0;
export const DEFAULT_LFO_WAVEFORM: OscillatorType = "sine";
export const DEFAULT_LFO_TARGET: LfoTarget = "none";

export const LFO_TARGETS = ["none", "filter", "pitch", "volume"] as const;
export type LfoTarget = (typeof LFO_TARGETS)[number];

export const isLfoTarget = (value: unknown): value is LfoTarget =>
  typeof value === "string" && LFO_TARGETS.includes(value as LfoTarget);
