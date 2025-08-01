// components/VisitTracker.tsx
"use client";

import { useEffect } from 'react';

const VisitTracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch('/api/visits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error("Failed to track visit:", error);
      }
    };

    trackVisit();
  }, []);

  return null;
};

export default VisitTracker;