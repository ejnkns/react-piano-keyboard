import { FrequencyState, Pitch, SetOptions } from '../types';
type UseKeyboardProps = SetOptions & {
    initialFrequencyStates?: FrequencyState[];
    audioContext?: AudioContext;
    analyserNode?: AnalyserNode;
};
export declare const useMusicNotes: ({ oscillator: defaultOscillator, gain: defaultMaxGain, attack: initialAttack, decay: initialDecay, audioContext, analyserNode, }?: UseKeyboardProps) => {
    start: (note: Pitch) => void;
    stop: (note: Pitch) => void;
    stopAll: () => void;
    set: ({ oscillator: newOsc, gain: newGain, attack: newAttack, decay: newDecay }: SetOptions) => void;
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
export type UseMusicNotes = ReturnType<typeof useMusicNotes>;
export {};
//# sourceMappingURL=useMusicNotes.d.ts.map