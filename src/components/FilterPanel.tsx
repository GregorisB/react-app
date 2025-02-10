import React from 'react';
import { Filter } from '../types';
import { Sliders } from 'lucide-react';

const PRESET_FILTERS: Filter[] = [
  { name: 'None', value: 'none' },
  { name: 'Grayscale', value: 'grayscale(100%)' },
  { name: 'Sepia', value: 'sepia(100%)' },
  { name: 'Blur', value: 'blur(5px)' },
  { name: 'Brightness', value: 'brightness(150%)' },
  { name: 'Contrast', value: 'contrast(200%)' },
  { name: 'Hue Rotate', value: 'hue-rotate(90deg)' },
  { name: 'Invert', value: 'invert(100%)' },
];

interface FilterPanelProps {
  onSelectFilter: (filter: Filter) => void;
  selectedFilter: string;
}

export function FilterPanel({ onSelectFilter, selectedFilter }: FilterPanelProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PRESET_FILTERS.map(filter => (
          <button
            key={filter.name}
            onClick={() => onSelectFilter(filter)}
            className={`p-2 rounded text-sm ${
              selectedFilter === filter.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
}