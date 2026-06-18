import { useCallback, useRef, useState, useEffect } from "react";
import "../../styles.css";

export type SliderProps = {
  name: string;
  defaultValue?: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  scale?: "linear" | "log";
  direction?: "vertical" | "horizontal";
  fillWidth?: number;
  onChange?: (value: number) => void;
};

export const Slider = ({
  name,
  defaultValue,
  min,
  max,
  step,
  unit,
  scale = "linear",
  direction = "vertical",
  fillWidth,
  onChange,
}: SliderProps) => {
  const [value, setValue] = useState(defaultValue ?? min);
  const valueRef = useRef(value);
  valueRef.current = value;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const prevDefaultRef = useRef(defaultValue);
  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== prevDefaultRef.current) {
      setValue(defaultValue);
      prevDefaultRef.current = defaultValue;
    }
  }, [defaultValue]);

  const dragState = useRef<{ startPos: number; startValue: number } | null>(
    null,
  );

  const toFrac = (v: number) =>
    scale === "log"
      ? (Math.log(v) - Math.log(min)) / (Math.log(max) - Math.log(min))
      : (v - min) / (max - min);

  const fromFrac = (f: number) => {
    const raw =
      scale === "log"
        ? Math.exp(Math.log(min) + f * (Math.log(max) - Math.log(min)))
        : min + f * (max - min);
    return snap(clamp(raw));
  };

  const fraction = toFrac(value);

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
      dragState.current = {
        startPos: direction === "horizontal" ? e.clientX : e.clientY,
        startValue: value,
      };
    },
    [value, direction],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.current) return;
      const delta =
        direction === "horizontal"
          ? e.clientX - dragState.current.startPos
          : dragState.current.startPos - e.clientY;
      const trackPx = direction === "horizontal" ? (fillWidth ?? 160) - 16 : 72;
      const sensitivity = trackPx;
      const startFrac = toFrac(dragState.current.startValue);
      const snapped = fromFrac(startFrac + delta / sensitivity);
      setValue(snapped);
      onChangeRef.current?.(snapped);
    },
    [min, max, step, direction, fillWidth],
  );

  const handlePointerUp = useCallback(() => {
    if (!dragState.current) return;
    dragState.current = null;
    onChangeRef.current?.(valueRef.current);
  }, []);

  if (direction === "horizontal") {
    const svgW = fillWidth ?? 160;
    const svgH = 18;
    const trackH = 4;
    const trackY = (svgH - trackH) / 2;
    const trackW = svgW - 16;
    const trackX = 8;
    const thumbR = 5;
    const thumbCx = trackX + fraction * trackW;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: direction === "horizontal" ? "column" : "row",
          alignItems: "center",
          gap: 6,
          width: svgW,
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            cursor: "ew-resize",
            touchAction: "none",
            lineHeight: 0,
            flex: 1,
          }}
        >
          <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
            <defs>
              <filter id={`${name}-slider-glow`}>
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="1.5"
                  floodColor="var(--piano-accent)"
                  floodOpacity="0.4"
                />
              </filter>
            </defs>

            <rect
              x={trackX}
              y={trackY}
              width={trackW}
              height={trackH}
              rx={trackH / 2}
              fill="var(--piano-bg-elevated)"
              stroke="var(--piano-border-strong)"
              strokeWidth={1}
            />

            <rect
              x={trackX}
              y={trackY}
              width={thumbCx - trackX}
              height={trackH}
              rx={trackH / 2}
              fill="var(--piano-accent)"
            />

            <circle
              cx={thumbCx}
              cy={svgH / 2}
              r={thumbR}
              fill="var(--piano-accent)"
              filter={`url(#${name}-slider-glow)`}
            />
            <circle
              cx={thumbCx}
              cy={svgH / 2}
              r={thumbR - 1.5}
              fill="var(--piano-bg-elevated)"
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            fontFamily: "ui-monospace, monospace",
            color: "var(--piano-accent)",
            fontVariantNumeric: "tabular-nums",
            background: "var(--piano-bg-tertiary)",
            border: "1px solid var(--piano-accent)",
            borderRadius: 3,
            padding: "1px 6px",
            lineHeight: "16px",
            whiteSpace: "nowrap",
          }}
        >
          {formatValue(value)}
          {unit ?? ""}
        </span>
      </div>
    );
  }

  const trackH = 72;
  const trackW = 4;
  const thumbR = 5;
  const svgH = trackH + 12;
  const svgW = 28;
  const cy = svgH / 2;
  const trackTop = cy - trackH / 2;
  const trackBottom = cy + trackH / 2;
  const fillH = fraction * trackH;
  const fillBottom = trackBottom;
  const fillTop = trackBottom - fillH;
  const thumbCx = svgW / 2;
  const thumbCy = fillTop;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        userSelect: "none",
        WebkitUserSelect: "none",
        width: 64,
        padding: "8px 0",
      }}
    >
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
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ cursor: "ns-resize", touchAction: "none", lineHeight: 0 }}
      >
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          <defs>
            <filter id={`${name}-slider-glow`}>
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="1.5"
                floodColor="var(--piano-accent)"
                floodOpacity="0.4"
              />
            </filter>
          </defs>

          <rect
            x={thumbCx - trackW / 2}
            y={trackTop}
            width={trackW}
            height={trackH}
            rx={trackW / 2}
            fill="var(--piano-bg-elevated)"
            stroke="var(--piano-border-strong)"
            strokeWidth={1}
          />

          <rect
            x={thumbCx - trackW / 2}
            y={fillTop}
            width={trackW}
            height={fillH}
            rx={trackW / 2}
            fill="var(--piano-accent)"
          />

          <circle
            cx={thumbCx}
            cy={thumbCy}
            r={thumbR}
            fill="var(--piano-accent)"
            filter={`url(#${name}-slider-glow)`}
          />
          <circle
            cx={thumbCx}
            cy={thumbCy}
            r={thumbR - 1.5}
            fill="var(--piano-bg-elevated)"
          />
        </svg>
      </div>
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
        {formatValue(value)}
        {unit ?? ""}
      </span>
    </div>
  );
};
