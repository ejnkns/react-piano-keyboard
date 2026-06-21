import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PianoKeyboard } from "@react-piano-keyboard/piano-keyboard";
import { Piano } from "./piano";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

describe("piano composition", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("renders the batteries-included piano with its keyboard", () => {
    act(() => root.render(<Piano />));

    expect(container.querySelector(".piano")).not.toBeNull();
    expect(container.querySelector('[title="Power On"]')).not.toBeNull();
    expect(container.querySelectorAll(".piano-note").length).toBeGreaterThan(
      20,
    );
  });

  it("keeps scoped keyboard input on the focused wrapper", () => {
    const onNoteOn = vi.fn();
    act(() => root.render(<PianoKeyboard onNoteOn={onNoteOn} />));
    const keyboard = container.querySelector<HTMLElement>('[tabindex="0"]');
    expect(keyboard).not.toBeNull();

    act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "z" })));
    expect(onNoteOn).not.toHaveBeenCalled();

    act(() =>
      keyboard?.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "z" }),
      ),
    );
    expect(onNoteOn).toHaveBeenCalledWith("C3");
  });

  it("supports opt-in global keyboard input", () => {
    const onNoteOn = vi.fn();
    act(() =>
      root.render(
        <PianoKeyboard keyboardInput="global" onNoteOn={onNoteOn} />,
      ),
    );

    act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "z" })));
    expect(onNoteOn).toHaveBeenCalledWith("C3");
  });

  it("registers no active global binding when keyboard input is disabled", () => {
    const onNoteOn = vi.fn();
    act(() =>
      root.render(<PianoKeyboard keyboardInput={false} onNoteOn={onNoteOn} />),
    );

    act(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "z" })));
    expect(onNoteOn).not.toHaveBeenCalled();
  });
});
