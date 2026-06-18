import { type ReactElement } from "react";
import { Slider } from "./slider";
import { FilterVisualizer } from "./filter-visualizer";
import { FilterTypePicker } from "./filter/filter-type-picker";
import type { Handlers } from "./shared/handlers";

export function getFilterSection({
  defaultValues,
  handlers,
}: {
  defaultValues?: {
    filterType?: string;
    filterCutoff?: number;
    filterResonance?: number;
  };
  handlers: Handlers;
}): { title: string; controls: { control: () => ReactElement }[] } {
  return {
    title: "Filter",
    controls: [
      {
        control: () => (
          <Slider
            key="resonance"
            name="Resonance"
            defaultValue={defaultValues?.filterResonance}
            min={0.1}
            max={20}
            step={0.1}
            onChange={handlers.filterResonance}
          />
        ),
      },
      {
        control: () => (
          <FilterTypePicker
            key="filter-type"
            defaultValue={defaultValues?.filterType}
            onChange={handlers.filterType}
          />
        ),
      },
      {
        control: () => (
          <FilterVisualizer
            key="filter-viz"
            filterType={(defaultValues?.filterType ?? "lowpass") as BiquadFilterType}
            cutoff={defaultValues?.filterCutoff ?? 20000}
            resonance={defaultValues?.filterResonance ?? 0.1}
            onCutoffChange={handlers.filterCutoff}
          />
        ),
      },
    ],
  };
}
