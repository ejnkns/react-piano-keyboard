import { useMemo } from "react";
import type { Pitches } from "@react-piano-keyboard/music";
import "./piano-keyboard.css";
import {
  getPianoKeyboardLayout,
  type PianoKeyboardLayoutOptions,
} from "./get-piano-keyboard-layout";
import { PianoNotes } from "./piano-notes";
import { useKeyboardHandlers } from "./use-keyboard-handlers";
import { useKeyboardInput } from "./use-keyboard-input";

export type PianoKeyboardInputMode = "scoped" | "global" | false;

export type PianoKeyboardProps = PianoKeyboardLayoutOptions & {
  onNoteOn?: (note: Pitches.Pitch) => void;
  onNoteOff?: (note: Pitches.Pitch) => void;
  playingNotes?: Pitches.Pitch[];
  keyMap?: Record<string, Pitches.Pitch>;
  editMode?: boolean;
  onAssignKey?: (key: string) => void;
  selectedNote?: Pitches.Pitch | null;
  conflictNote?: Pitches.Pitch | null;
  onNoteSelect?: (note: Pitches.Pitch) => void;
  keyboardInput?: PianoKeyboardInputMode;
  tabIndex?: number;
};

const noop = () => {};

export const PianoKeyboard = ({
  rows = 1,
  start = "C3",
  end,
  onNoteOn = noop,
  onNoteOff = noop,
  playingNotes,
  keyMap,
  editMode,
  onAssignKey,
  selectedNote,
  conflictNote,
  onNoteSelect,
  keyboardInput = "scoped",
  tabIndex,
}: PianoKeyboardProps) => {
  const layout = useMemo(
    () => getPianoKeyboardLayout({ rows, start, end }),
    [end, rows, start],
  );
  const activeMap = keyMap ?? layout.keyMap;
  const scoped = keyboardInput === "scoped";
  const global = keyboardInput === "global";

  const keyboardProps = useKeyboardHandlers({
    start: onNoteOn,
    stop: onNoteOff,
    activeMap,
    editMode: scoped && editMode,
    onAssignKey,
    enabled: scoped,
  });

  useKeyboardInput({
    start: onNoteOn,
    stop: onNoteOff,
    activeMap,
    editMode: global && editMode,
    onAssignKey,
    enabled: global,
  });

  const shared = {
    audio: {
      start: onNoteOn,
      stop: onNoteOff,
      playingNotes,
    },
    mapping: {
      keyNoteMap: layout.keyMap,
      customKeyMap: keyMap,
      editMode,
      selectedNote,
      conflictNote,
      onNoteSelect,
    },
  } as const;

  return (
    <div
      tabIndex={scoped ? (tabIndex ?? keyboardProps.tabIndex) : tabIndex}
      onKeyDown={scoped ? keyboardProps.onKeyDown : undefined}
      onKeyUp={scoped ? keyboardProps.onKeyUp : undefined}
      onPointerDown={
        scoped ? (event) => event.currentTarget.focus() : undefined
      }
    >
      {layout.rowNotes ? (
        <>
          <PianoNotes
            id="piano-keyboard-top"
            notes={layout.rowNotes[1]}
            whiteCount={layout.whiteKeyCount}
            {...shared}
          />
          <PianoNotes
            id="piano-keyboard-bottom"
            notes={layout.rowNotes[0]}
            whiteCount={layout.whiteKeyCount}
            {...shared}
          />
        </>
      ) : (
        <PianoNotes id="piano-keyboard" notes={layout.notes} {...shared} />
      )}
    </div>
  );
};

export { PianoNotes } from "./piano-notes";
export type { PianoNotesProps } from "./piano-notes";
export {
  getPianoKeyboardLayout,
  type PianoKeyboardLayout,
  type PianoKeyboardLayoutOptions,
} from "./get-piano-keyboard-layout";
export { useKeyboardHandlers } from "./use-keyboard-handlers";
export type { KeyboardBindingOptions } from "./use-keyboard-handlers";
export { useKeyboardInput } from "./use-keyboard-input";
export { useKeyMapping } from "./use-key-mapping";
export * from "./computer-keyboard-layout";
export * from "./keyboard-mapping";
