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
          suppressHydrationWarning
        >
          {region}
        </button>
      ))}

    </div>
  );
}
