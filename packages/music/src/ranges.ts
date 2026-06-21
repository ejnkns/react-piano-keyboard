import { pitchToIndex, indexToPitch } from "./pitches";
import { Pitches } from "./pitches";

export const getPitchRangeForWhiteKeyCount = (
  start: Pitches.Pitch,
  whiteKeyCount: number,
): Pitches.Pitch[] => {
  const result: Pitches.Pitch[] = [];
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
