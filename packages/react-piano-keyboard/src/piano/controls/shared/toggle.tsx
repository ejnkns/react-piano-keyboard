type ToggleProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
};

export const Toggle = ({ checked, onChange }: ToggleProps) => {
  const w = 28;
  const h = 14;
  const thumbR = 4.5;
  const thumbOff = 6.5;
  const thumbOn = w - thumbOff;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className="touch-none cursor-pointer bg-transparent border-none p-0 m-0 leading-[0]"
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect
          x={0}
          y={0}
          width={w}
          height={h}
          rx={h / 2}
          fill={checked ? "var(--piano-accent)" : "var(--piano-border-strong)"}
          opacity={checked ? 1 : 0.35}
        />
        <circle
          cx={checked ? thumbOn : thumbOff}
          cy={h / 2}
          r={thumbR}
          fill="var(--piano-bg-elevated)"
        />
      </svg>
    </button>
  );
};
