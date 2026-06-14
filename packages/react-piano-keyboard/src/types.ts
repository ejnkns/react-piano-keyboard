import { PITCH_CLASSES } from "./constants";

export type PitchClass = (typeof PITCH_CLASSES)[number];
export type Pitch = `${PitchClass}${number}`;

export type PitchData = {
  pitchClass: PitchClass;
  octave: number;
  cents: number;
};

export const OSCILLATORS = [
  "sine",
  "sawtooth",
  "square",
  "triangle",
] satisfies OscillatorType[];
export type Oscillator = (typeof OSCILLATORS)[number];

export const isOscillatorType = (value: unknown): value is Oscillator =>
  typeof value === "string" && OSCILLATORS.includes(value as Oscillator);

export const isPitchClass = (input: unknown): input is PitchClass =>
  typeof input === "string" && PITCH_CLASSES.includes(input as PitchClass);

export const isPitch = (input: unknown): input is Pitch => {
  if (typeof input !== "string") return false;
  const match = input.match(/^([A-G]#?)(\d+)$/);
  if (!match) return false;
  return PITCH_CLASSES.includes(match[1] as PitchClass);
};

export type FrequencyState = {
  oscillator: Oscillator;
  gain: number;
  hz: number;
  playing: boolean;
  touched: boolean;
};

export type SetOptions = {
  oscillator?: Oscillator;
  gain?: number;
  attack?: number;
  decay?: number;
};

export type GetPitchRangeInput = {
  start: Pitch;
  end: Pitch;
};
