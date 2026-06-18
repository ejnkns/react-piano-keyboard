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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: 8,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--piano-text-muted)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Filter
      </span>
      <div
        style={{
          background: "var(--piano-bg-tertiary)",
          border: "1px solid var(--piano-accent)",
          borderRadius: 4,
          padding: 4,
        }}
      >
        {["lowpass", "highpass", "bandpass", "notch"].map((ft) => {
          const isSelected = selected === ft;
          return (
            <button
              key={ft}
              type="button"
              className={isSelected ? "selected" : ""}
              onClick={() => {
                setSelected(ft as BiquadFilterType);
                onChange?.(ft);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "3px 6px",
                margin: 0,
                border: "none",
                borderRadius: 2,
                background: isSelected ? "var(--piano-accent)" : "transparent",
                color: isSelected
                  ? "var(--piano-bg-tertiary)"
                  : "var(--piano-accent)",
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                textAlign: "left",
                cursor: "pointer",
                lineHeight: "14px",
              }}
            >
              {ft}
            </button>
          );
        })}
      </div>
    </div>
  );
}
