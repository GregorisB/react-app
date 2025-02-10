import { useEffect, useRef } from "react";
import { Layer } from "../types";

interface CanvasProps {
  layers: Layer[];
  width: number;
  height: number;
}

export function Canvas({ layers, width, height }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Render layers in order
    layers
      .filter((layer) => layer.visible)
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach((layer) => {
        ctx.globalAlpha = layer.opacity;
        ctx.filter = layer.filter;

        if (layer.type === "image") {
          const img = new Image();
          img.src = layer.content;
          img.onload = () => {
            ctx.drawImage(img, layer.position.x, layer.position.y);
          };
        } else if (layer.type === "text") {
          ctx.font = "24px Arial";
          ctx.fillStyle = "#000000";
          ctx.fillText(layer.content, layer.position.x, layer.position.y);
        }
      });
  }, [layers, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-300 rounded-lg shadow-lg"
    />
  );
}
