import { PITCH_CLASSES } from './constants';
export type PitchClass = (typeof PITCH_CLASSES)[number];
export type Pitch = `${PitchClass}${number}`;
export type PitchData = {
    pitchClass: PitchClass;
    octave: number;
    cents: number;
};
export declare const OSCILLATORS: ("sawtooth" | "sine" | "square" | "triangle")[];
export type Oscillator = (typeof OSCILLATORS)[number];
export declare const isOscillatorType: (value: unknown) => value is Oscillator;
export declare const isPitchClass: (input: unknown) => input is PitchClass;
export declare const isPitch: (input: unknown) => input is Pitch;
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
//# sourceMappingURL=types.d.ts.map