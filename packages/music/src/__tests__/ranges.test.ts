import { describe, it, expect } from "vitest";
import { getPitchRangeForWhiteKeyCount } from "../ranges";

describe("getPitchRangeForWhiteKeyCount", () => {
  it("returns empty array for zero white keys", () => {
    expect(getPitchRangeForWhiteKeyCount("C3", 0)).toEqual([]);
  });

  it("returns one white key from C3", () => {
    expect(getPitchRangeForWhiteKeyCount("C3", 1)).toEqual(["C3"]);
  });

  it("returns two white keys from D3", () => {
    expect(getPitchRangeForWhiteKeyCount("D3", 2)).toEqual(["D3", "D#3", "E3"]);
  });

  it("returns exactly 11 white keys from C3 through F4", () => {
    const range = getPitchRangeForWhiteKeyCount("C3", 11);
    expect(range[0]).toBe("C3");
    expect(range[range.length - 1]).toBe("F4");
    expect(range.filter((note) => !note.includes("#")).length).toBe(11);
  });

  it("handles a black key as the start", () => {
    const range = getPitchRangeForWhiteKeyCount("C#3", 2);
    expect(range.filter((note) => !note.includes("#")).length).toBe(2);
  });
});
