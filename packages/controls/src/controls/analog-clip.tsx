import { Slider } from "./shared/slider";
import { AnalogClipVisualizer } from "./analog-clip/analog-clip-visualizer";
import type { SetFn } from "../controls-types";
import type { ControlValues } from "@react-piano-keyboard/shared";

export type AnalogClipHandlers = {
  analogClipDrive: (v: number) => void;
  analogClipInput: (v: number) => void;
  analogClipEnabled: (v: boolean) => void;
};

export function getAnalogClipHandlers(set: SetFn): AnalogClipHandlers {
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
  defaultValues?: Partial<ControlValues>;
  handlers: AnalogClipHandlers;
}) {
  return {
    title: "Analog Clip" as const,
    size: "full" as const,
    onToggle: handlers.analogClipEnabled,
    group: (
      <div className="bg-piano-bg-tertiary border border-piano-accent rounded p-2 h-full flex flex-col items-center">
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <AnalogClipVisualizer
            drive={defaultValues?.analogClipDrive ?? 1.5}
            input={defaultValues?.analogClipInput ?? 0.5}
          />
        </div>
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
    ),
  };
}
