import { useMemo } from "react";
import {
  Pitches,
  getPitchRange,
  getPitchRangeForWhiteKeyCount,
  OctaveRows,
} from "@react-piano-keyboard/shared";
import { PianoNotes } from "./piano-notes";
import { useKeyboardInput } from "./use-keyboard-input";

export type PianoKeyboardProps = {
  rows?: 1 | 2;
  start?: Pitches.Pitch | { bottom: Pitches.Pitch; top?: Pitches.Pitch };
  end?: Pitches.Pitch;
  onNoteOn?: (note: Pitches.Pitch) => void;
  onNoteOff?: (note: Pitches.Pitch) => void;
  keyMap?: Record<string, Pitches.Pitch>;
  editMode?: boolean;
  onAssignKey?: (key: string) => void;
  selectedNote?: Pitches.Pitch | null;
  conflictNote?: Pitches.Pitch | null;
  onNoteSelect?: (note: Pitches.Pitch) => void;
};

export const PianoKeyboard = ({
  rows = 1,
  start = "C4" as Pitches.Pitch,
  end,
  onNoteOn,
  onNoteOff,
  keyMap = {},
  editMode,
  onAssignKey,
  selectedNote,
  conflictNote,
  onNoteSelect,
}: PianoKeyboardProps) => {
  const { notes, rowNotes, maxWhiteCount } = useMemo(() => {
    if (rows === 1) {
      const range = getPitchRange({
        start: start as Pitches.Pitch,
        end: end ?? (start as Pitches.Pitch),
      });
      return { notes: range, rowNotes: null, maxWhiteCount: undefined as number | undefined };
    }

    const bottomTop =
      typeof start === "object"
        ? start
        : { bottom: start, top: start };
    const bottomCount = OctaveRows.bottom.whiteKeys.length;
    const topCount = OctaveRows.top.whiteKeys.length;
    const bottomNotes = getPitchRangeForWhiteKeyCount(bottomTop.bottom, bottomCount);
    const topNotes = getPitchRangeForWhiteKeyCount(
      bottomTop.top ?? bottomTop.bottom,
      topCount,
    );
    const maxWhite = Math.max(
      bottomNotes.filter((k) => !k.includes("#")).length,
      topNotes.filter((k) => !k.includes("#")).length,
    );

    return {
      notes: [...bottomNotes, ...topNotes],
      rowNotes: [bottomNotes, topNotes] as [Pitches.Pitch[], Pitches.Pitch[]],
      maxWhiteCount: maxWhite,
    };
  }, [rows, start, end]);

  const startFn = onNoteOn ?? (() => {});
  const stopFn = onNoteOff ?? (() => {});

  useKeyboardInput({
    start: startFn,
    stop: stopFn,
    activeMap: keyMap,
    editMode,
    onAssignKey,
    enabled: !editMode,
  });

  const shared = {
    audio: {
      start: (note: Pitches.Pitch) => startFn(note),
      stop: (note: Pitches.Pitch) => stopFn(note),
      playingNotes: undefined as Pitches.Pitch[] | undefined,
    },
    mapping: {
      keyNoteMap: keyMap,
      editMode,
      selectedNote,
      conflictNote,
      onNoteSelect,
    },
  } as const;

  if (rowNotes) {
    return (
      <>
        <PianoNotes
          id="piano-keyboard-top"
          notes={rowNotes[1]}
          whiteCount={maxWhiteCount}
          {...shared}
        />
        <PianoNotes
          id="piano-keyboard-bottom"
          notes={rowNotes[0]}
          whiteCount={maxWhiteCount}
          {...shared}
        />
      </>
    );
  }

  return (
    <PianoNotes
      id="piano-keyboard"
      notes={notes}
      {...shared}
    />
  );
};
