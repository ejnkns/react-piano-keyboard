import { useState, useEffect } from "react";
import { isFilterType } from "@react-piano-keyboard/audio/defaults";
import { Slider } from "./shared/slider";
import { Picker, type PickerOption } from "./shared/picker";
import { FilterVisualizer } from "./filter/filter-visualizer";
import type { SetFn } from "../controls-types";

export type FilterHandlers = {
  filterCutoff: (v: number) => void;
  filterResonance: (v: number) => void;
  filterType: (v: string) => void;
  filterEnabled: (v: boolean) => void;
};

export function getFilterHandlers(set: SetFn): FilterHandlers {
  return {
    filterCutoff: (v: number) => set({ filterCutoff: v }),
    filterResonance: (v: number) => set({ filterResonance: v }),
    filterType: (v: string) => {
      if (isFilterType(v)) set({ filterType: v });
    },
    filterEnabled: (v: boolean) => set({ filterEnabled: v }),
  };
}

const FILTER_TYPES: PickerOption[] = [
  { value: "lowpass" },
  { value: "highpass" },
  { value: "bandpass" },
  { value: "notch" },
];

function FilterGroup({
  defaultValues,
  handlers,
}: {
  defaultValues?: {
    filterType?: string;
    filterCutoff?: number;
    filterResonance?: number;
  };
  handlers: FilterHandlers;
}) {
  const [filterType, setFilterType] = useState<BiquadFilterType>(() =>
    isFilterType(defaultValues?.filterType)
      ? (defaultValues!.filterType as BiquadFilterType)
      : "lowpass",
  );

  useEffect(() => {
    if (
      defaultValues?.filterType !== undefined &&
      isFilterType(defaultValues.filterType) &&
      defaultValues.filterType !== filterType
    ) {
      setFilterType(defaultValues.filterType as BiquadFilterType);
    }
  }, [defaultValues?.filterType]);

  return (
    <div className="bg-piano-bg-tertiary border border-piano-accent rounded p-2 h-full">
      <div className="flex items-start gap-2">
        <Picker
          label="Filter"
          options={FILTER_TYPES}
          value={filterType}
          onChange={(v) => {
            setFilterType(v as BiquadFilterType);
            handlers.filterType(v);
          }}
        />
        <Slider
          name="Resonance"
          defaultValue={defaultValues?.filterResonance}
          min={0.1}
          max={20}
          step={0.1}
          onChange={handlers.filterResonance}
        />
        <div className="flex flex-col gap-0.5 items-center">
          <FilterVisualizer
            filterType={filterType}
            cutoff={defaultValues?.filterCutoff ?? 20000}
            resonance={defaultValues?.filterResonance ?? 0.1}
          />
          <Slider
            name="cutoff"
            defaultValue={defaultValues?.filterCutoff}
            min={20}
            max={20000}
            step={1}
            scale="log"
            direction="horizontal"
            fillWidth={220}
            onChange={handlers.filterCutoff}
          />
        </div>
      </div>
    </div>
  );
}

export function getFilterSection({
  defaultValues,
  handlers,
}: {
  defaultValues?: {
    filterType?: string;
    filterCutoff?: number;
    filterResonance?: number;
    filterEnabled?: boolean;
  };
  handlers: FilterHandlers;
}) {
  return {
    title: "Filter" as const,
    size: "half" as const,
    onToggle: handlers.filterEnabled,
    group: <FilterGroup defaultValues={defaultValues} handlers={handlers} />,
  };
}
