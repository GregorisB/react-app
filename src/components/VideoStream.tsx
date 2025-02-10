import { useEffect, useRef } from "react";
import { CHARACTER_OVERLAYS } from "../constants";
import { VideoEffect } from "../types";

interface VideoStreamProps {
  stream: MediaStream;
  effect: VideoEffect;
  muted?: boolean;
}

export function VideoStream({
  stream,
  effect,
  muted = false,
}: VideoStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const characterImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.srcObject) {
      video.srcObject = null;
    }

    const handleCanPlay = () => {
      video.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    };

    video.addEventListener("canplay", handleCanPlay);
    video.srcObject = stream;

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      if (video.srcObject) {
        video.srcObject = null;
      }
    };
  }, [stream]);

  useEffect(() => {
    // Load character image if it's a character effect
    if (effect.startsWith("character-")) {
      const overlay =
        CHARACTER_OVERLAYS[
          effect as unknown as keyof typeof CHARACTER_OVERLAYS
        ];
      if (overlay) {
        const img = new Image();
        img.src = overlay.url;
        img.onload = () => {
          characterImageRef.current = img;
        };
      }
    } else {
      characterImageRef.current = null;
    }
  }, [effect]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.srcObject) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let isDrawing = true;

    const draw = () => {
      if (!isDrawing) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply base effect
        ctx.filter = getEffectFilter(effect);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Draw character overlay if applicable
        if (effect.startsWith("character-") && characterImageRef.current) {
          const overlay =
            CHARACTER_OVERLAYS[
              effect as unknown as keyof typeof CHARACTER_OVERLAYS
            ];
          if (overlay) {
            const size = Math.min(canvas.width, canvas.height) * overlay.scale;
            const x = (canvas.width - size) / 2 + overlay.offsetX;
            const y = (canvas.height - size) / 2 + overlay.offsetY;

            ctx.filter = "none"; // Reset filter for the character
            ctx.drawImage(characterImageRef.current, x, y, size, size);
          }
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      isDrawing = false;
      cancelAnimationFrame(animationFrame);
    };
  }, [effect]);

  const getEffectFilter = (effect: VideoEffect): string => {
    switch (effect) {
      case "grayscale":
        return "grayscale(100%)";
      case "sepia":
        return "sepia(100%)";
      case "blur":
        return "blur(4px)";
      case "invert":
        return "invert(100%)";
      case "cartoon":
        return "saturate(150%) contrast(140%)";
      case "pixel":
        return "url(#pixel)";
      case "rainbow":
        return "saturate(200%) hue-rotate(45deg)";
      default:
        return "none";
    }
  };

  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className="hidden"
      />
      <canvas ref={canvasRef} className="w-full h-full object-contain" />
    </div>
  );
}
