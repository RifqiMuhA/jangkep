'use client';

import { Play } from 'lucide-react';

interface FilterBarProps {
  regions: string[];
  activeRegion: string;
  onRegionChange: (region: string) => void;
  onAutoTourStart: () => void;
  isAutoTourActive: boolean;
  onSearchChange: (query: string) => void;
}

export function FilterBar({
  regions,
  activeRegion,
  onRegionChange,
  onAutoTourStart,
  isAutoTourActive,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="explore-filter-bar">
      {/* Filter Pills */}
      {regions.map((region) => (
        <button
          key={region}
          className={`filter-pill ${activeRegion === region ? 'active' : ''}`}
          onClick={() => onRegionChange(region)}
        >
          {region}
        </button>
      ))}

      {/* Search */}
      <div className="filter-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(242,234,211,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Cari makanan / kota…"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Auto Tour Button */}
      <button
        className="auto-tour-btn"
        onClick={onAutoTourStart}
        disabled={isAutoTourActive}
      >
        <Play size={12} fill="currentColor" />
        Tur Bareng Si Podo
      </button>
    </div>
  );
}
