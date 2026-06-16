import {
  TwoKeyboardRowBlackKeys,
  TwoKeyboardRowWhiteKeys,
  FourKeyboardRowBlackKeys,
  FourKeyboardRowWhiteKeys,
  FourKeyboardRowNotesLength,
  OctaveRows,
} from "../keyboard-layout";
import { pitchToIndex, indexToPitch } from "../pitches";
import { Pitch } from "../types";

export const getPitchRangeForWhiteKeyCount = (
  start: Pitch,
  whiteKeyCount: number,
): Pitch[] => {
  const result: Pitch[] = [];
  const startIdx = pitchToIndex(start);
  let whiteSeen = 0;
  let i = 0;

  while (whiteSeen < whiteKeyCount) {
    const note = indexToPitch(startIdx + i);
    if (!note) break;
    result.push(note);
    if (!note.includes("#")) {
      whiteSeen++;
    }
    i++;
  }

  return result;
};

const isWhite = (note: Pitch) => !note.includes("#");

export const getKeyToNoteMap = (keys: Pitch[]) => {
  if (!keys[0]) return {};

  const isTwoRows =
    keys.length <= TwoKeyboardRowWhiteKeys.length + TwoKeyboardRowBlackKeys.length;

  let whiteIndex = 0;
  const firstNoteIsWhite = isWhite(keys[0]);
  let blackIndex = firstNoteIsWhite ? 1 : 0;

  return keys.reduce((acc, key, index) => {
    const prevKey = index > 0 ? keys[index - 1] : undefined;
    const prevWasWhite = prevKey && isWhite(prevKey);
    if (isWhite(key)) {
      const whiteKey = isTwoRows
        ? TwoKeyboardRowWhiteKeys[whiteIndex]
        : FourKeyboardRowWhiteKeys[whiteIndex];
      if (whiteKey) {
        acc[whiteKey] = key;
        whiteIndex++;

        if (prevWasWhite) blackIndex++;
      }
    } else {
      const blackKey = isTwoRows
        ? TwoKeyboardRowBlackKeys[blackIndex]
        : FourKeyboardRowBlackKeys[
            index >= FourKeyboardRowNotesLength ? blackIndex + 1 : blackIndex
          ];
      if (blackKey) {
        acc[blackKey] = key;
        blackIndex++;
      }
    }

    return acc;
  }, {} as Record<string, Pitch>);
};

export const mapNotesToRow = (
  notes: Pitch[],
  whiteKeys: readonly string[],
  blackKeys: readonly string[],
): Record<string, Pitch> => {
  const result: Record<string, Pitch> = {};
  let wi = 0;

  for (const note of notes) {
    if (!note.includes("#")) {
      const key = whiteKeys[wi];
      if (key) result[key] = note;
      wi++;
    } else {
      const key = blackKeys[wi];
      if (key) result[key] = note;
    }
  }

  return result;
};

export const getTwoRowKeyToNoteMap = (
  bottomNotes: Pitch[],
  topNotes: Pitch[],
): Record<string, Pitch> => {
  return {
    ...mapNotesToRow(bottomNotes, OctaveRows.bottom.whiteKeys, OctaveRows.bottom.blackKeys),
    ...mapNotesToRow(topNotes, OctaveRows.top.whiteKeys, OctaveRows.top.blackKeys),
  };
};
