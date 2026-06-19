import { type ReactElement } from "react";
import { Slider } from "./slider";
import { AnalogClipVisualizer } from "./analog-clip-visualizer";
import type { Handlers } from "./shared/handlers";
import type { Audio } from "../../use-piano/use-music-notes";

export function getAnalogClipSection({
  defaultValues,
  handlers,
}: {
  defaultValues?: Partial<Audio.SetOptions>;
  handlers: Handlers;
}) {
  const section = (
    title: string,
    ...controls: { control: () => ReactElement }[]
  ) => ({
    title,
    controls,
  });

  return section("Analog Clip", {
    control: () => (
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
    ),
  });
}
