import { useCallback, useRef, useState } from "react";
import "../../styles.css";

export type KnobProps = {
  name: string;
  defaultValue?: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange?: (value: number) => void;
};

const START_ANGLE = -135;
const END_ANGLE = 135;
const RANGE = END_ANGLE - START_ANGLE;

export const Knob = ({ name, defaultValue, min, max, step, unit, onChange }: KnobProps) => {
  const [value, setValue] = useState(defaultValue ?? min);
  const valueRef = useRef(value);
  valueRef.current = value;

  const dragState = useRef<{ startY: number; startValue: number } | null>(null);

  const fraction = (value - min) / (max - min);
  const angle = START_ANGLE + fraction * RANGE;

  const formatValue = (v: number) => {
    if (step >= 1) return v.toFixed(0);
    if (step >= 0.1) return v.toFixed(1);
    return v.toFixed(2);
  };

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const snap = (v: number) => Math.round(v / step) * step;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragState.current = { startY: e.clientY, startValue: value };
    },
    [value]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.current) return;
      const deltaY = dragState.current.startY - e.clientY;
      const range = max - min;
      const sensitivity = 150;
      const raw = dragState.current.startValue + (deltaY / sensitivity) * range;
      const clamped = clamp(raw);
      const snapped = snap(clamped);
      setValue(snapped);
    },
    [min, max, step]
  );

  const handlePointerUp = useCallback(() => {
    if (!dragState.current) return;
    dragState.current = null;
    onChange?.(valueRef.current);
  }, [onChange]);

  const arcCenter = 32;
  const arcRadius = 24;
  const thickness = 4;
  const innerRadius = arcRadius - thickness;

  const polarToCartesian = (cx: number, cy: number, r: number, a: number) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const arcStart = polarToCartesian(arcCenter, arcCenter, arcRadius, START_ANGLE);
  const arcEnd = polarToCartesian(arcCenter, arcCenter, arcRadius, angle);
  const trackEnd = polarToCartesian(arcCenter, arcCenter, arcRadius, END_ANGLE);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        userSelect: "none",
        WebkitUserSelect: "none",
        width: 72,
      }}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ cursor: "ns-resize", touchAction: "none", lineHeight: 0 }}
      >
        <svg width={64} height={64} viewBox="0 0 64 64">
          <defs>
            <radialGradient id={`${name}-knob-bg`} cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="var(--piano-text-muted)" />
              <stop offset="100%" stopColor="var(--piano-bg-elevated)" />
            </radialGradient>
            <radialGradient id={`${name}-knob-highlight`} cx="40%" cy="30%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <filter id={`${name}-knob-shadow`}>
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
            </filter>
          </defs>

          <path
            d={`M ${arcStart.x} ${arcStart.y} A ${arcRadius} ${arcRadius} 0 0 1 ${trackEnd.x} ${trackEnd.y}`}
            fill="none"
            stroke="var(--piano-border-strong)"
            strokeWidth={thickness}
            strokeLinecap="round"
          />

          <path
            d={`M ${arcStart.x} ${arcStart.y} A ${arcRadius} ${arcRadius} 0 ${angle > START_ANGLE + 180 ? "1" : "0"} 1 ${arcEnd.x} ${arcEnd.y}`}
            fill="none"
            stroke="var(--piano-accent)"
            strokeWidth={thickness}
            strokeLinecap="round"
          />

          <circle
            cx={arcCenter}
            cy={arcCenter}
            r={innerRadius}
            fill={`url(#${name}-knob-bg)`}
            filter={`url(#${name}-knob-shadow)`}
          />
          <circle
            cx={arcCenter}
            cy={arcCenter}
            r={innerRadius}
            fill={`url(#${name}-knob-highlight)`}
          />

          <line
            x1={arcCenter}
            y1={arcCenter}
            x2={arcEnd.x}
            y2={arcEnd.y}
            stroke="var(--piano-text-primary)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          <circle cx={arcCenter} cy={arcCenter} r={3} fill="var(--piano-accent)" />
        </svg>
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--piano-text-muted)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontFamily: "ui-monospace, monospace",
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "ui-monospace, monospace",
          color: "var(--piano-accent)",
          background: "var(--piano-bg-tertiary)",
          border: "1px solid var(--piano-accent)",
          borderRadius: 3,
          padding: "1px 6px",
          fontVariantNumeric: "tabular-nums",
          lineHeight: "16px",
        }}
      >
        {formatValue(value)}{unit ?? ""}
      </span>
    </div>
  );
};
