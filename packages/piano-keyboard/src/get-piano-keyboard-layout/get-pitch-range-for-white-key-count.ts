import {
  indexToPitch,
  pitchToIndex,
  type Pitches,
} from "@react-piano-keyboard/music";

export const getPitchRangeForWhiteKeyCount = (
  start: Pitches.Pitch,
  whiteKeyCount: number,
): Pitches.Pitch[] => {
  const notes: Pitches.Pitch[] = [];
  const startIndex = pitchToIndex(start);
  let whiteNotesSeen = 0;

  for (let offset = 0; whiteNotesSeen < whiteKeyCount; offset++) {
    const note = indexToPitch(startIndex + offset);
    if (!note) break;

    notes.push(note);
    if (!note.includes("#")) whiteNotesSeen++;
  }

  return notes;
};
