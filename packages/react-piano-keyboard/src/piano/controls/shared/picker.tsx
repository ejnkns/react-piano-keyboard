import { useId, useCallback, useRef } from "react";
import type { ReactNode } from "react";

export type PickerOption = {
  value: string;
  label?: string;
  icon?: ReactNode;
};

export type PickerProps = {
  label: string;
  options: PickerOption[];
  value: string;
  onChange: (value: string) => void;
  children?: (option: PickerOption, isSelected: boolean) => ReactNode;
};

export const Picker = ({
  label,
  options,
  value,
  onChange,
  children,
}: PickerProps) => {
  const labelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const cur = options.findIndex((o) => o.value === value);
      let next = cur;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          next = Math.min(cur + 1, options.length - 1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          next = Math.max(cur - 1, 0);
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = options.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      if (next !== cur) {
        onChange(options[next]!.value);
        const btns =
          containerRef.current?.querySelectorAll<HTMLButtonElement>(
            "[role=radio]",
          );
        btns?.[next]?.focus();
      }
    },
    [options, value, onChange],
  );

  return (
    <div className="flex flex-col items-center gap-1.5 p-2">
      <span
        id={labelId}
        className="text-[10px] font-semibold text-piano-text-muted tracking-[0.05em] uppercase font-mono"
      >
        {label}
      </span>
      <div
        ref={containerRef}
        role="radiogroup"
        aria-labelledby={labelId}
        className="bg-piano-bg-tertiary border border-piano-accent rounded p-1"
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              type="button"
              onClick={() => onChange(option.value)}
              onKeyDown={handleKeyDown}
              className={`group block w-full p-[3px_6px] m-0 border-none rounded font-mono text-[10px] text-left cursor-pointer leading-[14px] ${
                isSelected
                  ? "bg-piano-accent text-piano-bg-tertiary"
                  : "bg-transparent text-piano-accent"
              }`}
            >
              {children ? (
                children(option, isSelected)
              ) : (
                <>
                  {option.icon}
                  {option.label ?? option.value}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
