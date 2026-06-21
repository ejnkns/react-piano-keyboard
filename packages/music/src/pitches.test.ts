import { describe, expect, it } from "vitest";
import {
  getPitchRange,
  indexToPitch,
  isPitch,
  pitchToFrequency,
  pitchToIndex,
} from "./pitches";

describe("pitches", () => {
  it("converts A4 to its reference frequency", () => {
    expect(pitchToFrequency("A4")).toBe(440);
  });

  it("round-trips pitches through chromatic indexes", () => {
    expect(indexToPitch(pitchToIndex("C#4"))).toBe("C#4");
  });

  it("creates an inclusive chromatic range", () => {
    expect(getPitchRange({ start: "C3", end: "E3" })).toEqual([
      "C3",
      "C#3",
      "D3",
      "D#3",
      "E3",
    ]);
  });

  it("rejects malformed pitch names", () => {
    expect(isPitch("H4")).toBe(false);
    expect(isPitch("C#4")).toBe(true);
  });
});
