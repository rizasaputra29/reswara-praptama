// components/WaveSeparator.tsx
import React from 'react';

const WaveSeparator = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full z-0">
      <svg
        className="block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          // FIX: Ubah fill="#ffffff" menjadi fill="currentcolor"
          fill="currentcolor"
          fillOpacity="1"
          d="M0,50 C360,-10 1080,110 1440,50 L1440,120 L0,120 Z"
        ></path>
      </svg>
    </div>
  );
};

export default WaveSeparator;