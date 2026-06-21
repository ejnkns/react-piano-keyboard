import { describe, expect, it } from "vitest";
import { getPianoKeyboardLayout } from "./get-piano-keyboard-layout";
import {
  FourKeyboardRowWhiteKeys,
  OctaveRows,
} from "./computer-keyboard-layout";

describe("getPianoKeyboardLayout", () => {
  it("fills the default one-row computer keyboard range", () => {
    const layout = getPianoKeyboardLayout({ start: "C3" });

    expect(layout.notes[0]).toBe("C3");
    expect(layout.whiteKeyCount).toBe(FourKeyboardRowWhiteKeys.length);
    expect(layout.rowNotes).toBeUndefined();
    expect(layout.keyMap.z).toBe("C3");
  });

  it("honors an explicit chromatic end pitch", () => {
    const layout = getPianoKeyboardLayout({ start: "D3", end: "E3" });

    expect(layout.notes).toEqual(["D3", "D#3", "E3"]);
    expect(layout.noteRange).toEqual({ min: "D3", max: "E3" });
  });

  it("calculates both two-row ranges and a unique aggregate range", () => {
    const layout = getPianoKeyboardLayout({
      rows: 2,
      start: { bottom: "C3", top: "C4" },
    });

    expect(
      layout.rowNotes?.[0].filter((note) => !note.includes("#")),
    ).toHaveLength(OctaveRows.bottom.whiteKeys.length);
    expect(
      layout.rowNotes?.[1].filter((note) => !note.includes("#")),
    ).toHaveLength(OctaveRows.top.whiteKeys.length);
    expect(new Set(layout.notes).size).toBe(layout.notes.length);
    expect(layout.whiteKeyCount).toBe(11);
  });

  it("retains a black starting key while counting rendered white keys", () => {
    const layout = getPianoKeyboardLayout({ start: "C#3" });

    expect(layout.notes[0]).toBe("C#3");
    expect(layout.whiteKeyCount).toBe(FourKeyboardRowWhiteKeys.length);
  });
});
