import { useRef, useEffect } from "react";

export type AudioEnvelope = {
  gain: number;
  note: string;
};

export const AudioVisualizer = ({ data }: { data: AudioEnvelope[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // This is meant to be a simple state visualizer,
    // rendering the current activity data.
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "var(--piano-accent)";

    const barWidth = width / (data.length || 1);
    data.forEach((envelope, index) => {
      const x = index * barWidth;
      const barHeight = (envelope.gain ?? 0) * height;
      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
    });
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={330}
      height={150}
      style={{
        display: "block",
        backgroundColor: "var(--piano-bg-tertiary)",
        borderRadius: "4px",
      }}
    />
  );
};
