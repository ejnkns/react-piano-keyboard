export const NO_MARGIN_NOTES = ["C", "F"];

export const FourKeyboardRowWhiteKeys = [
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  ",",
  ".",
  "/",
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "[",
  "]",
  "\\",
] as const;

export const FourKeyboardRowBlackKeys = [
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  ";",
  "'",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "-",
  "=",
] as const;

export const TwoKeyboardRowWhiteKeys = [
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  ";",
  "'",
] as const;

export const TwoKeyboardRowBlackKeys = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "[",
  "]",
  "\\",
] as const;

export const FourKeyboardRowNotesLength = 17;

export type OctaveRow = {
  whiteKeys: readonly string[];
  blackKeys: readonly string[];
  whiteStart: number;
  blackStart: number;
};

export const OctaveRows: { bottom: OctaveRow; top: OctaveRow } = {
  bottom: {
    whiteKeys: ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "q"],
    blackKeys: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    whiteStart: 0,
    blackStart: 0,
  },
  top: {
    whiteKeys: ["w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
    blackKeys: ["2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    whiteStart: 7,
    blackStart: 0,
  },
};
