export declare const NO_MARGIN_NOTES: string[];
export declare const FourKeyboardRowWhiteKeys: readonly ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"];
export declare const FourKeyboardRowBlackKeys: readonly ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="];
export declare const TwoKeyboardRowWhiteKeys: readonly ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"];
export declare const TwoKeyboardRowBlackKeys: readonly ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"];
export declare const FourKeyboardRowNotesLength = 17;
export type OctaveRow = {
    whiteKeys: readonly string[];
    blackKeys: readonly string[];
    whiteStart: number;
    blackStart: number;
};
export declare const OctaveRows: {
    bottom: OctaveRow;
    top: OctaveRow;
};
//# sourceMappingURL=Piano.constants.d.ts.map