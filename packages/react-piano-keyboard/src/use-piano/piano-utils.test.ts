import { describe, it, expect } from "vitest";
import {
  getKeyToNoteMap,
  getTwoRowKeyToNoteMap,
  getPitchRangeForWhiteKeyCount,
  mapNotesToRow,
} from "./piano-utils";
import { OctaveRows } from "../keyboard-layout";
import { getPitchRange } from "../pitches";

describe("getPitchRangeForWhiteKeyCount", () => {
  it("returns empty array for zero white keys", () => {
    expect(getPitchRangeForWhiteKeyCount("C3", 0)).toEqual([]);
  });

  it("returns one white key from C3", () => {
    const r = getPitchRangeForWhiteKeyCount("C3", 1);
    expect(r).toEqual(["C3"]);
  });

  it("returns two white keys from D3", () => {
    const r = getPitchRangeForWhiteKeyCount("D3", 2);
    expect(r).toEqual(["D3", "D#3", "E3"]);
  });

  it("returns exactly 11 white keys from C3 through F4", () => {
    const r = getPitchRangeForWhiteKeyCount("C3", 11);
    expect(r[0]).toBe("C3");
    expect(r[r.length - 1]).toBe("F4");
    expect(r.filter((n) => !n.includes("#")).length).toBe(11);
  });

  it("returns exactly 11 white keys from E3 through A4", () => {
    const r = getPitchRangeForWhiteKeyCount("E3", 11);
    expect(r[0]).toBe("E3");
    expect(r[r.length - 1]).toBe("A4");
    expect(r.filter((n) => !n.includes("#")).length).toBe(11);
  });

  it("returns 7 white keys from C3 (one octave, C3-B3)", () => {
    const r = getPitchRangeForWhiteKeyCount("C3", 7);
    expect(r[0]).toBe("C3");
    expect(r[r.length - 1]).toBe("B3");
    expect(r.filter((n) => !n.includes("#")).length).toBe(7);
  });

  it("handles a black key as the start (C#3)", () => {
    const r = getPitchRangeForWhiteKeyCount("C#3", 2);
    expect(r.filter((n) => !n.includes("#")).length).toBe(2);
  });
});

describe("mapNotesToRow", () => {
  it("maps bottom row C3-F4 starting at white index 0", () => {
    const notes = getPitchRangeForWhiteKeyCount(
      "C3",
      OctaveRows.bottom.whiteKeys.length,
    );
    const map = mapNotesToRow(
      notes,
      OctaveRows.bottom.whiteKeys,
      OctaveRows.bottom.blackKeys,
    );

    // first 7 white keys C3-B3
    expect(map["z"]).toBe("C3");
    expect(map["x"]).toBe("D3");
    expect(map["c"]).toBe("E3");
    expect(map["v"]).toBe("F3");
    expect(map["b"]).toBe("G3");
    expect(map["n"]).toBe("A3");
    expect(map["m"]).toBe("B3");

    // next 4 white keys C4-F4
    expect(map[","]).toBe("C4");
    expect(map["."]).toBe("D4");
    expect(map["/"]).toBe("E4");
    expect(map["q"]).toBe("F4");

    // black keys
    expect(map["s"]).toBe("C#3");
    expect(map["d"]).toBe("D#3");
    expect(map["g"]).toBe("F#3");
    expect(map["h"]).toBe("G#3");
    expect(map["j"]).toBe("A#3");
    expect(map["l"]).toBe("C#4");
    expect(map[";"]).toBe("D#4");
  });

  it("maps top row D4-G5 first white key to w", () => {
    const notes = getPitchRangeForWhiteKeyCount(
      "D4",
      OctaveRows.top.whiteKeys.length,
    );
    const map = mapNotesToRow(
      notes,
      OctaveRows.top.whiteKeys,
      OctaveRows.top.blackKeys,
    );

    // first white key D4 → w (not e)
    expect(map["w"]).toBe("D4");
    // second white key E4 → e
    expect(map["e"]).toBe("E4");
    // first black key D#4 → 3
    expect(map["3"]).toBe("D#4");
    // last white key G5 → ]
    expect(map["]"]).toBe("G5");
    // last black key F#5 → =
    expect(map["="]).toBe("F#5");
  });

  it("top row starting at C4 maps first white to w and first black to 3", () => {
    const notes = getPitchRangeForWhiteKeyCount(
      "C4",
      OctaveRows.top.whiteKeys.length,
    );
    const map = mapNotesToRow(
      notes,
      OctaveRows.top.whiteKeys,
      OctaveRows.top.blackKeys,
    );

    expect(map["w"]).toBe("C4");
    expect(map["3"]).toBe("C#4");
  });
});

describe("getTwoRowKeyToNoteMap", () => {
  it("returns empty object for both empty", () => {
    expect(getTwoRowKeyToNoteMap([], [])).toEqual({});
  });

  it("maps bottom row only when top is empty", () => {
    const bottom = getPitchRange({ start: "C3", end: "B3" });
    const map = getTwoRowKeyToNoteMap(bottom, []);
    expect(map["z"]).toBe("C3");
    expect(map["m"]).toBe("B3");
    expect(map["w"]).toBeUndefined();
  });

  it("maps top row only when bottom is empty", () => {
    const top = getPitchRange({ start: "C4", end: "B4" });
    const map = getTwoRowKeyToNoteMap([], top);
    expect(map["w"]).toBe("C4");
    expect(map["i"]).toBe("B4");
    expect(map["z"]).toBeUndefined();
  });

  it("maps both rows independently with non-overlapping ranges", () => {
    const bottom = getPitchRange({ start: "C3", end: "F4" });
    const top = getPitchRange({ start: "C5", end: "F6" });
    const map = getTwoRowKeyToNoteMap(bottom, top);

    expect(map["z"]).toBe("C3");
    expect(map["q"]).toBe("B4");
    expect(map["w"]).toBe("C5");
    expect(map["]"]).toBe("F6");
  });

  it("maps overlapping ranges — bottom C3-F4, top C4-F5", () => {
    const bottom = getPitchRangeForWhiteKeyCount("C3", 11);
    const top = getPitchRangeForWhiteKeyCount("C4", 11);
    const map = getTwoRowKeyToNoteMap(bottom, top);

    // bottom white keys
    expect(map["z"]).toBe("C3");
    expect(map["x"]).toBe("D3");
    expect(map["c"]).toBe("E3");
    expect(map["v"]).toBe("F3");
    expect(map["b"]).toBe("G3");
    expect(map["n"]).toBe("A3");
    expect(map["m"]).toBe("B3");
    expect(map[","]).toBe("C4");
    expect(map["."]).toBe("D4");
    expect(map["/"]).toBe("E4");
    expect(map["q"]).toBe("B3");

    // bottom black keys
    expect(map["s"]).toBe("C#3");
    expect(map["d"]).toBe("D#3");
    expect(map["g"]).toBe("F#3");
    expect(map["h"]).toBe("G#3");
    expect(map["j"]).toBe("A#3");
    expect(map["l"]).toBe("C#4");
    expect(map[";"]).toBe("D#4");

    // top white keys
    expect(map["w"]).toBe("C4");
    expect(map["e"]).toBe("D4");
    expect(map["r"]).toBe("E4");
    expect(map["t"]).toBe("F4");
    expect(map["y"]).toBe("G4");
    expect(map["u"]).toBe("A4");
    expect(map["i"]).toBe("B4");
    expect(map["o"]).toBe("C5");
    expect(map["p"]).toBe("D5");
    expect(map["["]).toBe("E5");
    expect(map["]"]).toBe("F5");

    // top black keys
    expect(map["3"]).toBe("C#4");
    expect(map["4"]).toBe("D#4");
    expect(map["6"]).toBe("F#4");
    expect(map["7"]).toBe("G#4");
    expect(map["8"]).toBe("A#4");
    expect(map["0"]).toBe("C#5");
    expect(map["-"]).toBe("D#5");

    // overlapping notes have mappings from BOTH rows (different keys)
    // C4: bottom→,, top→w
    expect(map[","]).toBe("C4");
    expect(map["w"]).toBe("C4");
    // D4: bottom→., top→e
    expect(map["."]).toBe("D4");
    expect(map["e"]).toBe("D4");
    // E4: bottom→/, top→r
    expect(map["/"]).toBe("E4");
    expect(map["r"]).toBe("E4");
    // F4: top→t (q is special mapped to preceding white note B3)
    expect(map["q"]).toBe("B3");
    expect(map["t"]).toBe("F4");
  });

  it("identical ranges (both C3) produce independent key bindings", () => {
    const bottom = getPitchRangeForWhiteKeyCount("C3", 11);
    const top = getPitchRangeForWhiteKeyCount("C3", 11);
    const map = getTwoRowKeyToNoteMap(bottom, top);

    expect(map["z"]).toBe("C3");
    expect(map["w"]).toBe("C3");
    expect(map["s"]).toBe("C#3");
    expect(map["3"]).toBe("C#3");
  });

  it("does not map beyond 11 white keys per row", () => {
    const bottom = getPitchRangeForWhiteKeyCount("C3", 11);
    const map = getTwoRowKeyToNoteMap(bottom, []);
    // Only 11 white key entries in OctaveRows.bottom
    expect(Object.keys(map).length).toBeLessThanOrEqual(22); // 11 white + 11 black max
  });

  it("maps ' to the black note after / when one exists (F4→F#4)", () => {
    const bottom = getPitchRangeForWhiteKeyCount("D3", 10);
    const top = getPitchRangeForWhiteKeyCount("D#4", 11);
    const map = getTwoRowKeyToNoteMap(bottom, top);

    // 10 white notes from D3: D3, E3, F3, G3, A3, B3, C4, D4, E4, F4
    // / → F4, next note = F#4 (black)
    expect(map["/"]).toBe("F4");
    expect(map["'"]).toBe("F#4");
  });

  it("does not map ' when / is E or B (no black note follows)", () => {
    const bottomC = getPitchRangeForWhiteKeyCount("C3", 10);
    const bottomG = getPitchRangeForWhiteKeyCount("G3", 10);
    const top = getPitchRangeForWhiteKeyCount("C4", 11);

    // C3: / → E4, next = F4 (white) → ' unbound
    expect(getTwoRowKeyToNoteMap(bottomC, top)["'"]).toBeUndefined();
    // G3: / → B4, next = C5 (white) → ' unbound
    expect(getTwoRowKeyToNoteMap(bottomG, top)["'"]).toBeUndefined();
  });

  it("bottom C3 top D4 — top row first note D4 maps to w not e", () => {
    const bottom = getPitchRangeForWhiteKeyCount(
      "C3",
      OctaveRows.bottom.whiteKeys.length,
    );
    const top = getPitchRangeForWhiteKeyCount(
      "D4",
      OctaveRows.top.whiteKeys.length,
    );
    const map = getTwoRowKeyToNoteMap(bottom, top);

    // top row: D4 is first white key → w (regression: was e)
    expect(map["w"]).toBe("D4");
    expect(map["e"]).toBe("E4");
    expect(map["3"]).toBe("D#4");

    // bottom row: C4 and C#4 exist only in bottom
    expect(map[","]).toBe("C4");
    expect(map["l"]).toBe("C#4");

    // D4 has bindings from both rows
    expect(map["."]).toBe("D4");
    expect(map["w"]).toBe("D4");

    // 2 maps to the black note one semitone below w (D4→C#4)
    expect(map["2"]).toBe("C#4");
  });

  it("maps 2 to the black note one semitone below w when one exists", () => {
    // G4 start: w = G4, one semitone below = F#4 (black)
    const bottom = getPitchRangeForWhiteKeyCount("C3", 11);
    const top = getPitchRangeForWhiteKeyCount("G4", 11);
    const map = getTwoRowKeyToNoteMap(bottom, top);

    expect(map["w"]).toBe("G4");
    expect(map["2"]).toBe("F#4");
  });

  it("does not map 2 when w is C or F (no black note below)", () => {
    // C4 start
    const bottom = getPitchRangeForWhiteKeyCount("C3", 11);
    const topC = getPitchRangeForWhiteKeyCount("C4", 11);
    const topF = getPitchRangeForWhiteKeyCount("F4", 11);

    expect(getTwoRowKeyToNoteMap(bottom, topC)["2"]).toBeUndefined();
    expect(getTwoRowKeyToNoteMap(bottom, topF)["2"]).toBeUndefined();
  });
});

describe("getKeyToNoteMap", () => {
  it("returns empty object for empty keys", () => {
    expect(getKeyToNoteMap([])).toEqual({});
  });

  it("maps a small range (C3-B3) using two-row flat layout", () => {
    const keys = getPitchRange({ start: "C3", end: "B3" });
    const map = getKeyToNoteMap(keys);

    expect(map["a"]).toBe("C3");
    expect(map["s"]).toBe("D3");
    expect(map["d"]).toBe("E3");
    expect(map["f"]).toBe("F3");
    expect(map["g"]).toBe("G3");
    expect(map["h"]).toBe("A3");
    expect(map["j"]).toBe("B3");
  });

  it("maps two-row range (C3-F4)", () => {
    const keys = getPitchRange({ start: "C3", end: "F4" });
    const map = getKeyToNoteMap(keys);

    expect(Object.keys(map).length).toBeGreaterThan(0);
    expect(map["k"]).toBe("C4");
  });

  describe("gap handling", () => {
    it("E-F gap bumps blackIndex, skipping TwoKeyboardRowBlackKeys index 3 ('r')", () => {
      const keys = getPitchRange({ start: "C3", end: "B3" });
      const map = getKeyToNoteMap(keys);

      expect(map["f"]).toBe("F3");
      expect(map["t"]).toBe("F#3");
      expect(map["r"]).toBeUndefined();
    });

    it("B-C gap bumps blackIndex, skipping TwoKeyboardRowBlackKeys index 7 ('i')", () => {
      const keys = getPitchRange({ start: "C3", end: "C#4" });
      const map = getKeyToNoteMap(keys);

      expect(map["k"]).toBe("C4");
      expect(map["o"]).toBe("C#4");
      expect(map["i"]).toBeUndefined();
    });

    it("both gaps work across full two-octave range (C3-B4) in TwoRows layout", () => {
      const keys = getPitchRange({ start: "C3", end: "B4" });
      const map = getKeyToNoteMap(keys);

      expect(map["f"]).toBe("F3");
      expect(map["t"]).toBe("F#3");
      expect(map["k"]).toBe("C4");
      expect(map["o"]).toBe("C#4");
      expect(map["r"]).toBeUndefined();
      expect(map["i"]).toBeUndefined();
    });

    it("handles gaps correctly starting from D3", () => {
      const keys = getPitchRange({ start: "D3", end: "D4" });
      const map = getKeyToNoteMap(keys);

      expect(map["a"]).toBe("D3");
      expect(map["s"]).toBe("E3");
      expect(map["d"]).toBe("F3");
    });
  });
});
