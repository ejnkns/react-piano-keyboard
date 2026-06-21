import {
  getPitchRange,
  pitchToIndex,
  type Pitches,
} from "@react-piano-keyboard/music";
import {
  FourKeyboardRowWhiteKeys,
  OctaveRows,
} from "./computer-keyboard-layout";
import { getKeyToNoteMap, getTwoRowKeyToNoteMap } from "./keyboard-mapping";
import { getPitchRangeForWhiteKeyCount } from "./get-piano-keyboard-layout/get-pitch-range-for-white-key-count";

export type PianoKeyboardLayoutOptions = {
  rows?: 1 | 2;
  start?: Pitches.Pitch | { bottom: Pitches.Pitch; top?: Pitches.Pitch };
  end?: Pitches.Pitch;
};

export type PianoKeyboardLayout = {
  notes: Pitches.Pitch[];
  rowNotes?: readonly [Pitches.Pitch[], Pitches.Pitch[]];
  keyMap: Record<string, Pitches.Pitch>;
  whiteKeyCount: number;
  noteRange?: { min: Pitches.Pitch; max: Pitches.Pitch };
};

export const getPianoKeyboardLayout = ({
  rows = 1,
  start = "C3",
  end,
}: PianoKeyboardLayoutOptions = {}): PianoKeyboardLayout => {
  const bottomStart = typeof start === "string" ? start : start.bottom;

  if (rows === 1) {
    const notes = end
      ? getPitchRange({ start: bottomStart, end })
      : getPitchRangeForWhiteKeyCount(
          bottomStart,
          FourKeyboardRowWhiteKeys.length,
        );

    return {
      notes,
      keyMap: getKeyToNoteMap(notes),
      whiteKeyCount: notes.filter((note) => !note.includes("#")).length,
      noteRange: getNoteRange(notes),
    };
  }

  const topStart =
    typeof start === "string" ? start : (start.top ?? start.bottom);
  const bottomNotes = getPitchRangeForWhiteKeyCount(
    bottomStart,
    OctaveRows.bottom.whiteKeys.length,
  );
  const topNotes = getPitchRangeForWhiteKeyCount(
    topStart,
    OctaveRows.top.whiteKeys.length,
  );
  const notes = [...new Set([...bottomNotes, ...topNotes])].sort(
    (left, right) => pitchToIndex(left) - pitchToIndex(right),
  );

  return {
    notes,
    rowNotes: [bottomNotes, topNotes],
    keyMap: getTwoRowKeyToNoteMap(bottomNotes, topNotes),
    whiteKeyCount: Math.max(
      bottomNotes.filter((note) => !note.includes("#")).length,
      topNotes.filter((note) => !note.includes("#")).length,
    ),
    noteRange: getNoteRange(notes),
  };
};

const getNoteRange = (
  notes: Pitches.Pitch[],
): PianoKeyboardLayout["noteRange"] => {
  const min = notes[0];
  const max = notes[notes.length - 1];
  return min && max ? { min, max } : undefined;
};
