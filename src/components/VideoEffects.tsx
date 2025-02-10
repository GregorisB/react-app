import React from "react";
import { FilterEnum, VideoEffect } from "../types";
import { Sliders, Smile, Wand2 } from "lucide-react";

interface VideoEffectsProps {
  currentEffect: VideoEffect;
  onEffectChange: (effect: VideoEffect) => void;
}

const EFFECTS: { name: string; value: VideoEffect; icon: React.ReactNode }[] = [
  {
    name: "None",
    value: FilterEnum.None,
    icon: <Sliders className="w-4 h-4" />,
  },
  {
    name: "Grayscale",
    value: FilterEnum.Grayscale,
    icon: <Wand2 className="w-4 h-4" />,
  },
  {
    name: "Sepia",
    value: FilterEnum.Sepia,
    icon: <Wand2 className="w-4 h-4" />,
  },
  { name: "Blur", value: FilterEnum.Blur, icon: <Wand2 className="w-4 h-4" /> },
  {
    name: "Invert",
    value: FilterEnum.Invert,
    icon: <Wand2 className="w-4 h-4" />,
  },
  {
    name: "Cartoon",
    value: FilterEnum.Cartoon,
    icon: <Wand2 className="w-4 h-4" />,
  },
  {
    name: "Pixel",
    value: FilterEnum.Pixel,
    icon: <Wand2 className="w-4 h-4" />,
  },
  {
    name: "Rainbow",
    value: FilterEnum.Rainbow,
    icon: <Wand2 className="w-4 h-4" />,
  },
  {
    name: "Cute Dog",
    value: FilterEnum.Dog,
    icon: <Smile className="w-4 h-4" />,
  },
  {
    name: "Cool Cat",
    value: FilterEnum.Cat,
    icon: <Smile className="w-4 h-4" />,
  },
  {
    name: "Robot",
    value: FilterEnum.Robot,
    icon: <Smile className="w-4 h-4" />,
  },
  {
    name: "Mouse",
    value: FilterEnum.Mouse,
    icon: <Smile className="w-4 h-4" />,
  },
];

export function VideoEffects({
  currentEffect,
  onEffectChange,
}: VideoEffectsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Video Effects</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <h3 className="col-span-2 text-sm font-medium text-gray-700">
            Filters
          </h3>
          {EFFECTS.filter(
            (effect) => !effect.value.startsWith("character-")
          ).map((effect) => (
            <button
              key={effect.value}
              onClick={() => onEffectChange(effect.value)}
              className={`p-2 rounded text-sm flex items-center gap-2 ${
                currentEffect === effect.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {effect.icon}
              {effect.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <h3 className="col-span-2 text-sm font-medium text-gray-700">
            Characters
          </h3>
          {EFFECTS.filter((effect) =>
            effect.value.startsWith("character-")
          ).map((effect) => (
            <button
              key={effect.value}
              onClick={() => onEffectChange(effect.value)}
              className={`p-2 rounded text-sm flex items-center gap-2 ${
                currentEffect === effect.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {effect.icon}
              {effect.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
