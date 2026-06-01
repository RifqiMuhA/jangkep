'use client';

import React, { useState } from 'react';
import './BatikButton.css';

interface BatikButtonProps {
  javaneseText: string;
  latinText: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function BatikButton({ javaneseText, latinText, icon, onClick, className = '' }: BatikButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button 
      className={`batik-btn ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="batik-btn-inner">
        {icon && <span className="batik-btn-icon">{icon}</span>}
        <span className={isHovered ? "batik-btn-text-latin" : "batik-btn-text-java"}>
          {isHovered ? latinText : javaneseText}
        </span>
      </div>
    </button>
  );
}
