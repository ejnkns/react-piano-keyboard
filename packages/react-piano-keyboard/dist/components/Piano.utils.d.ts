import { Pitch } from '../types';
export declare const getPitchRangeForWhiteKeyCount: (start: Pitch, whiteKeyCount: number) => Pitch[];
export declare const getKeyToNoteMap: (keys: Pitch[]) => Record<string, `C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}`>;
export declare const mapNotesToRow: (notes: Pitch[], whiteKeys: readonly string[], blackKeys: readonly string[]) => Record<string, Pitch>;
export declare const getTwoRowKeyToNoteMap: (bottomNotes: Pitch[], topNotes: Pitch[]) => Record<string, Pitch>;
//# sourceMappingURL=Piano.utils.d.ts.map