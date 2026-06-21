import {
  TwoKeyboardRowBlackKeys,
  TwoKeyboardRowWhiteKeys,
  FourKeyboardRowBlackKeys,
  FourKeyboardRowWhiteKeys,
  FourKeyboardRowNotesLength,
  OctaveRows,
} from "./computer-keyboard-layout";
import {
  pitchToIndex,
  indexToPitch,
  Pitches,
} from "@react-piano-keyboard/music";

const isWhite = (note: Pitches.Pitch) => !note.includes("#");

export const getKeyToNoteMap = (keys: Pitches.Pitch[]) => {
  if (!keys[0]) return {};

  const isTwoRows =
    keys.length <=
    TwoKeyboardRowWhiteKeys.length + TwoKeyboardRowBlackKeys.length;

  let whiteIndex = 0;
  const firstNoteIsWhite = isWhite(keys[0]);
  let blackIndex = firstNoteIsWhite ? 1 : 0;

  return keys.reduce(
    (acc, key, index) => {
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
    },
    {} as Record<string, Pitches.Pitch>,
  );
};

export const mapNotesToRow = (
  notes: Pitches.Pitch[],
  whiteKeys: readonly string[],
  blackKeys: readonly string[],
): Record<string, Pitches.Pitch> => {
  const result: Record<string, Pitches.Pitch> = {};
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
  bottomNotes: Pitches.Pitch[],
  topNotes: Pitches.Pitch[],
): Record<string, Pitches.Pitch> => {
  const result = {
    ...mapNotesToRow(
      bottomNotes,
      OctaveRows.bottom.whiteKeys,
      OctaveRows.bottom.blackKeys,
    ),
    ...mapNotesToRow(
      topNotes,
      OctaveRows.top.whiteKeys,
      OctaveRows.top.blackKeys,
    ),
  };

  const topStart = topNotes[0];
  if (topStart) {
    const pitchClass = topStart.replace(/\d/, "");
    const offset = pitchClass === "C" || pitchClass === "F" ? 1 : 2;
    const qIdx = pitchToIndex(topStart) - offset;
    if (qIdx >= 0) {
      const precedingWhite = indexToPitch(qIdx);
      if (precedingWhite) result.q = precedingWhite;
    }
  }

  const lastWhiteNote = result["/"];
  if (lastWhiteNote) {
    const nextIdx = pitchToIndex(lastWhiteNote) + 1;
    const nextNote = indexToPitch(nextIdx);
    if (nextNote?.includes("#")) result["'"] = nextNote;
  }

  const topFirstWhite = result["w"];
  if (topFirstWhite) {
    const belowIdx = pitchToIndex(topFirstWhite) - 1;
    if (belowIdx >= 0) {
      const belowNote = indexToPitch(belowIdx);
      if (belowNote?.includes("#")) result["2"] = belowNote;
    }
  }

  return result;
};
