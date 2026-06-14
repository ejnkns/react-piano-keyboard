import { Pitch, Oscillator } from '../types';
export type UsePianoOptions = {
    rows?: 1 | 2;
    start?: Pitch | {
        bottom: Pitch;
        top?: Pitch;
    };
    end?: Pitch;
    audioContext?: AudioContext;
    analyserNode?: AnalyserNode;
    oscillator?: Oscillator;
    gain?: number;
    attack?: number;
    decay?: number;
};
export declare const usePiano: ({ rows, start: startProp, end, audioContext, analyserNode, oscillator, gain, attack, decay, }?: UsePianoOptions) => {
    notes: (`C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}`)[];
    allNotes: (`C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}`)[];
    rowNotes: readonly [(`C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}`)[], (`C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}`)[]] | undefined;
    defaultMap: Record<string, `C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}`>;
    audio: {
        start: (note: Pitch) => void;
        stop: (note: Pitch) => void;
        stopAll: () => void;
        set: ({ oscillator: newOsc, gain: newGain, attack: newAttack, decay: newDecay }: import('..').SetOptions) => void;
        state: {
            hz: number;
            gain: number;
            oscillator: "sawtooth" | "sine" | "square" | "triangle";
            playing: boolean;
            touched: boolean;
        }[];
        controlValues: {
            gain: number;
            oscillator: "sawtooth" | "sine" | "square" | "triangle";
            attack: number;
            decay: number;
        };
        playingNotes: (`C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}`)[];
    };
    mapping: {
        keyMap: Record<string, `C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}`>;
        editMode: boolean;
        selectedNote: `C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}` | null;
        conflictNote: `C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}` | null;
        toggleEditMode: () => void;
        selectNote: (note: Pitch) => void;
        assignKey: (key: string) => void;
        resetToDefaults: () => void;
    };
    inputProps: {
        onKeyDown: (e: import('react').KeyboardEvent<HTMLDivElement>) => void;
        onKeyUp: (e: import('react').KeyboardEvent<HTMLDivElement>) => void;
    };
};
//# sourceMappingURL=usePiano.d.ts.map