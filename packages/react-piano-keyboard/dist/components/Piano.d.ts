import { Pitch, Oscillator, SetOptions } from '../types';
export type PianoProps = {
    rows?: 1 | 2;
    start?: Pitch | {
        bottom: Pitch;
        top?: Pitch;
    };
    end?: Pitch;
    controls?: boolean | {
        onClose?: () => void;
        defaultValues?: Partial<SetOptions>;
    };
    waveform?: boolean | {
        width?: number;
        height?: number;
        strokeColor?: string;
        backgroundColor?: string;
    };
    audioContext?: AudioContext;
    analyserNode?: AnalyserNode;
    oscillator?: Oscillator;
    gain?: number;
    attack?: number;
    decay?: number;
};
export declare const Piano: ({ rows, start, end, controls: controlsProp, waveform: waveformProp, audioContext, analyserNode, oscillator, gain, attack, decay, }: PianoProps) => import("react").JSX.Element;
//# sourceMappingURL=Piano.d.ts.map