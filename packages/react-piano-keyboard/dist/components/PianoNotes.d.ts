import { Pitch } from '../types';
type AudioProps = {
    start: (note: Pitch) => void;
    stop: (note: Pitch) => void;
    playingNotes?: Pitch[];
};
type MappingProps = {
    keyNoteMap: Record<string, Pitch>;
    customKeyMap?: Record<string, Pitch>;
    editMode?: boolean;
    selectedNote?: Pitch | null;
    conflictNote?: Pitch | null;
    onNoteSelect?: (note: Pitch) => void;
};
export type PianoNotesProps = {
    id: string;
    notes: Pitch[];
    audio: AudioProps;
    mapping: MappingProps;
    whiteCount?: number;
};
export declare const PianoNotes: ({ notes, id, audio, mapping, whiteCount, }: PianoNotesProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=PianoNotes.d.ts.map