import { Oscillator } from "./types";

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
export const DEFAULT_OSCILLATOR = "sine" satisfies Oscillator;
