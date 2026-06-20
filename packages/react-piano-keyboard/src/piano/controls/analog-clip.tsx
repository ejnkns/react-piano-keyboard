import { Slider } from "./shared/slider";
import { AnalogClipVisualizer } from "./analog-clip/analog-clip-visualizer";
import type { Audio, UseMusicNotes } from "../../use-piano/use-music-notes";

export type AnalogClipHandlers = {
  analogClipDrive: (v: number) => void;
  analogClipInput: (v: number) => void;
  analogClipEnabled: (v: boolean) => void;
};

export function getAnalogClipHandlers(set: UseMusicNotes["set"]): AnalogClipHandlers {
  return {
    analogClipDrive: (v: number) => set({ analogClipDrive: v }),
    analogClipInput: (v: number) => set({ analogClipInput: v }),
    analogClipEnabled: (v: boolean) => set({ analogClipEnabled: v }),
  };
}

export function getAnalogClipSection({
  defaultValues,
  handlers,
}: {
  defaultValues?: Partial<Audio.SetOptions>;
  handlers: AnalogClipHandlers;
}) {
  return {
    title: "Analog Clip" as const,
    onToggle: handlers.analogClipEnabled,
    group: (
      <div className="bg-piano-bg-tertiary border border-piano-accent rounded p-2">
        <div className="flex flex-col gap-1 items-center">
          <AnalogClipVisualizer
            drive={defaultValues?.analogClipDrive ?? 1.5}
            input={defaultValues?.analogClipInput ?? 0.5}
          />
          <div className="flex gap-2 items-start">
            <Slider
              name="Drive"
              defaultValue={defaultValues?.analogClipDrive ?? 1.5}
              min={1}
              max={3}
              step={0.1}
              onChange={handlers.analogClipDrive}
            />
            <Slider
              name="Input"
              defaultValue={defaultValues?.analogClipInput ?? 0.5}
              min={0.1}
              max={1}
              step={0.1}
              onChange={handlers.analogClipInput}
            />
          </div>
        </div>
      </div>
    ),
  };
}
