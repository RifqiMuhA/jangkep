'use client';

import { Plus, Minus, Compass } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onAutoTourStart?: () => void;
  onAutoTourStop?: () => void;
  isAutoTourActive?: boolean;
}

export function MapControls({ onZoomIn, onZoomOut, onReset, onAutoTourStart, onAutoTourStop, isAutoTourActive }: MapControlsProps) {
  return (
    <div className="map-controls">
      {/* Auto Tour */}
      {(onAutoTourStart || onAutoTourStop) && (
        <button 
          className={`map-ctrl-btn auto-tour-right ${isAutoTourActive ? 'active' : ''}`} 
          onClick={isAutoTourActive ? onAutoTourStop : onAutoTourStart}
          suppressHydrationWarning
        >
          <span className="text-jawa" style={{ fontFamily: '"Noto Sans Javanese", sans-serif', fontSize: '15px' }}>
            {isAutoTourActive ? 'ꦩꦤ꧀ꦢꦼꦒ꧀' : 'ꦩꦶꦮꦶꦠꦶ ꦠꦸꦂ'}
          </span>
          <span className="text-indo">
            {isAutoTourActive ? 'Berhenti' : 'Mulai Tur'}
          </span>
        </button>
      )}

      {/* Reset */}
      <button className="map-ctrl-btn solo" onClick={onReset} suppressHydrationWarning>
        <Compass size={16} />
      </button>

      {/* Zoom */}
      <button className="map-ctrl-btn" onClick={onZoomIn} suppressHydrationWarning>
        <Plus size={16} />
      </button>
      <button className="map-ctrl-btn" onClick={onZoomOut} suppressHydrationWarning>
        <Minus size={16} />
      </button>
    </div>
  );
}
