import { Pitch } from '../types';
export declare const useKeyMapping: (notes: Pitch[], initialMap?: Record<string, Pitch>) => {
    keyMap: Record<string, `C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}`>;
    editMode: boolean;
    selectedNote: `C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}` | null;
    conflictNote: `C${number}` | `C#${number}` | `D${number}` | `D#${number}` | `E${number}` | `F${number}` | `F#${number}` | `G${number}` | `G#${number}` | `A${number}` | `A#${number}` | `B${number}` | null;
    toggleEditMode: () => void;
    selectNote: (note: Pitch) => void;
    assignKey: (key: string) => void;
    resetToDefaults: () => void;
};
//# sourceMappingURL=useKeyMapping.d.ts.map