import { useState, useEffect } from "react";
import { isFilterType } from "../../../constants";

export function FilterTypePicker({
  defaultValue,
  onChange,
}: {
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [selected, setSelected] = useState<BiquadFilterType>(() =>
    isFilterType(defaultValue) ? defaultValue : "lowpass",
  );

  useEffect(() => {
    if (
      defaultValue !== undefined &&
      isFilterType(defaultValue) &&
      defaultValue !== selected
    ) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="flex flex-col items-center gap-1.5 p-2">
      <span className="text-[10px] font-semibold text-piano-text-muted tracking-[0.05em] uppercase font-mono">
        Filter
      </span>
      <div className="bg-piano-bg-tertiary border border-piano-accent rounded p-1">
        {["lowpass", "highpass", "bandpass", "notch"].map((ft) => {
          const isSelected = selected === ft;
          return (
            <button
              key={ft}
              type="button"
              onClick={() => {
                setSelected(ft as BiquadFilterType);
                onChange?.(ft);
              }}
              className={`block w-full p-[3px_6px] m-0 border-none rounded font-mono text-[10px] text-left cursor-pointer leading-[14px] ${
                isSelected ? "bg-piano-accent text-piano-bg-tertiary" : "bg-transparent text-piano-accent"
              }`}
            >
              {ft}
            </button>
          );
        })}
      </div>
    </div>
  );
}
