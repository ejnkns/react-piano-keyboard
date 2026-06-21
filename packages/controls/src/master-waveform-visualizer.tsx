import { useRef, useEffect } from "react";

export const MasterWaveformVisualizer = ({
  analyserNode,
  width = 330,
  height = 150,
}: {
  analyserNode?: AnalyserNode;
  width?: number;
  height?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyserNode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const snapshotSize = analyserNode.frequencyBinCount;
    // ~60 frames/sec * 5 sec = 300 snapshots
    const historySnapshots = 300;
    const historyBuffer = new Uint8Array(historySnapshots * snapshotSize);
    let snapshotPointer = 0;
    const dataArray = new Uint8Array(snapshotSize);

    const draw = () => {
      analyserNode.getByteTimeDomainData(dataArray);
      historyBuffer.set(dataArray, snapshotPointer * snapshotSize);
      snapshotPointer = (snapshotPointer + 1) % historySnapshots;

      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = "var(--piano-accent)";
      ctx.lineWidth = 1;

      // Draw downsampled history
      const step = Math.ceil((historySnapshots * snapshotSize) / width);
      let x = 0;

      for (let i = 0; i < historySnapshots * snapshotSize; i += step) {
        const v = (historyBuffer[i] ?? 128) / 128.0;
        const y = (v * height) / 2;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += 1; // 1px per step
      }

      ctx.stroke();
      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [analyserNode, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: "block",
        backgroundColor: "var(--piano-bg-tertiary)",
        borderRadius: "4px",
      }}
    />
  );
};
