import { useEffect, useRef } from "react";
import "../styles.css";

const resolveCSSVar = (name: string, fallback: string, el: Element = document.documentElement) =>
  getComputedStyle(el)
    .getPropertyValue(name)
    .trim() || fallback;

export const WaveformVisualizer = ({
  analyserNode,
  width: propWidth,
  height = 60,
  strokeColor,
  backgroundColor,
}: {
  analyserNode?: AnalyserNode;
  width?: number;
  height?: number;
  strokeColor?: string;
  backgroundColor?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserNode?.frequencyBinCount ?? 0;
    const dataArray = bufferLength > 0 ? new Uint8Array(bufferLength) : null;

    const parent = canvas.parentElement;
    const resize = () => {
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = height;
      }
    };
    resize();

    const ro = new ResizeObserver(resize);
    if (parent) ro.observe(parent);

    let cachedBgColor = backgroundColor ?? resolveCSSVar("--piano-waveform-bg", "#000", canvas);
    let cachedStrokeColor = strokeColor ?? resolveCSSVar("--piano-accent", "#3b82f6", canvas);

    const observer = new MutationObserver(() => {
      cachedBgColor = backgroundColor ?? resolveCSSVar("--piano-waveform-bg", "#000", canvas);
      cachedStrokeColor = strokeColor ?? resolveCSSVar("--piano-accent", "#3b82f6", canvas);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = cachedBgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = cachedStrokeColor;
      ctx.beginPath();

      if (analyserNode && dataArray) {
        analyserNode.getByteTimeDomainData(dataArray);

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = (dataArray[i] ?? 128) / 128;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
      } else {
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
      }

      ctx.stroke();
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      ro.disconnect();
      observer.disconnect();
    };
  }, [analyserNode, height, strokeColor, backgroundColor]);

  return (
    <div
      style={{
        width: propWidth ? `${propWidth}px` : "100%",
        minWidth: 0,
        maxHeight: height,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height,
          borderRadius: "0.5rem",
        }}
        height={height}
      />
    </div>
  );
};
