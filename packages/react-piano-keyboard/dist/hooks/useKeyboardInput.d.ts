import { KeyboardEvent } from 'react';
import { Pitch } from '../types';
type UseKeyboardInputOptions = {
    start: (note: Pitch) => void;
    stop: (note: Pitch) => void;
    activeMap: Record<string, Pitch>;
    editMode?: boolean;
    onAssignKey?: (key: string) => void;
};
export declare const useKeyboardInput: ({ start, stop, activeMap, editMode, onAssignKey, }: UseKeyboardInputOptions) => {
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
    onKeyUp: (e: KeyboardEvent<HTMLDivElement>) => void;
};
export {};
//# sourceMappingURL=useKeyboardInput.d.ts.map