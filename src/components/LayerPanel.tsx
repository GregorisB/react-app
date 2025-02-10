import React from 'react';
import { Layer } from '../types';
import { Layers, Eye, EyeOff, Trash2 } from 'lucide-react';

interface LayerPanelProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDeleteLayer: (id: string) => void;
}

export function LayerPanel({
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleVisibility,
  onDeleteLayer,
}: LayerPanelProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Layers</h2>
      </div>
      <div className="space-y-2">
        {layers.map(layer => (
          <div
            key={layer.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${
              selectedLayerId === layer.id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => onSelectLayer(layer.id)}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={e => {
                  e.stopPropagation();
                  onToggleVisibility(layer.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {layer.visible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
              <span>{layer.type === 'image' ? 'Image Layer' : 'Text Layer'}</span>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                onDeleteLayer(layer.id);
              }}
              className="p-1 hover:bg-red-100 rounded text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}