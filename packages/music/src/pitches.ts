import {
  A4,
  A4_INDEX,
  DEFAULT_OCTAVE,
  PITCH_CLASSES,
  OCTAVE_LENGTH,
} from "./constants";

export namespace Pitches {
  export type PitchClass = (typeof PITCH_CLASSES)[number];
  export type Pitch = `${PitchClass}${number}`;
  export type PitchData = {
    pitchClass: PitchClass;
    octave: number;
    cents: number;
  };
  export type GetPitchRangeInput = {
    start: Pitch;
    end: Pitch;
  };
}

export const isPitchClass = (input: unknown): input is Pitches.PitchClass =>
  typeof input === "string" &&
  PITCH_CLASSES.includes(input as Pitches.PitchClass);

export const isPitch = (input: unknown): input is Pitches.Pitch => {
  if (typeof input !== "string") return false;
  const match = input.match(/^([A-G]#?)(\d+)$/);
  if (!match) return false;
  return PITCH_CLASSES.includes(match[1] as Pitches.PitchClass);
};

const sliceNote = (pitch: Pitches.Pitch) => {
  const pitchClass = pitch.slice(0, -1) as Pitches.PitchClass;
  const octave = parseInt(pitch.slice(-1));
  return { pitchClass, octave };
};

export const getPitchClass = (
  pitch: Pitches.Pitch | Pitches.PitchClass,
): Pitches.PitchClass => {
  return isPitch(pitch) ? sliceNote(pitch).pitchClass : pitch;
};

const getOctave = (pitch: Pitches.PitchClass | Pitches.Pitch) => {
  if (isPitch(pitch)) {
    return sliceNote(pitch).octave;
  }
  return DEFAULT_OCTAVE;
};

const makePitchData = (
  pitch: Pitches.PitchClass | Pitches.Pitch,
  octave?: number,
  cents?: number,
) =>
  ({
    pitchClass: getPitchClass(pitch),
    octave: octave || getOctave(pitch),
    cents: cents || 0,
  }) satisfies Pitches.PitchData;

export const pitchToFrequency = (
  pitch: Pitches.PitchData | Pitches.PitchClass | Pitches.Pitch,
) => {
  const pitchData = typeof pitch === "string" ? makePitchData(pitch) : pitch;
  const { pitchClass, octave, cents } = pitchData;

  const noteIndex = octave * OCTAVE_LENGTH + PITCH_CLASSES.indexOf(pitchClass);
  const frequencyRatio =
    Math.pow(2, (noteIndex - A4_INDEX) / OCTAVE_LENGTH) *
    Math.pow(2, cents / (100 * OCTAVE_LENGTH));

  const frequency = A4 * frequencyRatio;
  return Number(frequency.toFixed(2));
};

export const pitchToIndex = (pitch: Pitches.PitchData | Pitches.Pitch) => {
  const pitchData = typeof pitch === "string" ? makePitchData(pitch) : pitch;
  const { pitchClass, octave } = pitchData;
  const noteIndex = octave * OCTAVE_LENGTH + PITCH_CLASSES.indexOf(pitchClass);
  return noteIndex;
};

export const indexToPitchData = (index: number) => {
  const octave = Math.floor(index / OCTAVE_LENGTH);
  const pitchClassName = PITCH_CLASSES[index % OCTAVE_LENGTH];
  return pitchClassName && octave !== undefined
    ? {
        pitchClass: pitchClassName,
        octave,
        cents: 0,
      }
    : undefined;
};

export const indexToPitch = (index: number) => {
  const octave = Math.floor(index / OCTAVE_LENGTH);
  const pitchClassName = PITCH_CLASSES[index % OCTAVE_LENGTH];
  const pitch = `${pitchClassName}${octave}`;
  return isPitch(pitch) ? pitch : undefined;
};

export const getPitchRange = ({
  start,
  end,
}: Pitches.GetPitchRangeInput): Pitches.Pitch[] => {
  const startIndex = pitchToIndex(start);
  const endIndex = pitchToIndex(end);
  const pitches: Pitches.Pitch[] = [];

  for (let i = startIndex; i <= endIndex; i++) {
    const pitch = indexToPitch(i);
    if (pitch) {
      pitches.push(pitch);
    }
  }
  return pitches;
};
