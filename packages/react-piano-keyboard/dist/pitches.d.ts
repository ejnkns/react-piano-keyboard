import { PitchClass, Pitch, PitchData, GetPitchRangeInput } from './types';
export declare const getPitchClass: (pitch: Pitch | PitchClass) => PitchClass;
export declare const pitchToFrequency: (pitch: PitchData | PitchClass | Pitch) => number;
export declare const pitchToIndex: (pitch: PitchData | Pitch) => number;
export declare const indexToPitchData: (index: number) => {
    pitchClass: "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";
    octave: number;
    cents: number;
} | undefined;
export declare const indexToPitch: (index: number) => `C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}` | undefined;
export declare const getPitchRange: ({ start, end }: GetPitchRangeInput) => Pitch[];
//# sourceMappingURL=pitches.d.ts.map