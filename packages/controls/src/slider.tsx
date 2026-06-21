import { useCallback, useRef, useState, useEffect } from "react";

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
        className="flex flex-col items-center gap-1.5 select-none"
        style={{ width: svgW }}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="touch-none leading-0 flex-1 cursor-ew-resize"
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
        <span className="text-[10px] font-bold text-piano-accent font-mono tabular-nums bg-piano-bg-tertiary border border-piano-accent rounded-[3px] p-[1px_6px] leading-[16px] whitespace-nowrap">
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
    <div className="flex flex-col items-center gap-1 select-none w-16 py-2">
      <span className="text-[10px] font-semibold text-piano-text-muted tracking-[0.05em] uppercase font-mono">
        {name}
      </span>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="touch-none leading-[0] cursor-[ns-resize]"
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
      <span className="text-[10px] font-bold text-piano-accent font-mono tabular-nums bg-piano-bg-tertiary border border-piano-accent rounded-[3px] p-[1px_6px] leading-[16px]">
        {formatValue(value)}
        {unit ?? ""}
      </span>
    </div>
  );
};
