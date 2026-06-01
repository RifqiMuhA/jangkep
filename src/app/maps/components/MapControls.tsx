'use client';

import { Plus, Minus, Compass } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function MapControls({ onZoomIn, onZoomOut, onReset }: MapControlsProps) {
  return (
    <div className="map-controls">
      {/* Reset */}
      <button className="map-ctrl-btn solo" onClick={onReset}>
        <Compass size={16} />
      </button>

      {/* Zoom */}
      <button className="map-ctrl-btn" onClick={onZoomIn}>
        <Plus size={16} />
      </button>
      <button className="map-ctrl-btn" onClick={onZoomOut}>
        <Minus size={16} />
      </button>
    </div>
  );
}
