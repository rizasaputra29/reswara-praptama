// components/VisitTracker.tsx
"use client";

import { useEffect } from 'react';

const VisitTracker = () => {
  useEffect(() => {
    // Track visit only once per session
    const hasTrackedThisSession = sessionStorage.getItem('visitTracked');
    
    if (hasTrackedThisSession) {
      return;
    }
    
    const trackVisit = async () => {
      try {
        await fetch('/api/visits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        // Mark as tracked for this session
        sessionStorage.setItem('visitTracked', 'true');
      } catch (error) {
        console.error("Failed to track visit:", error);
      }
    };

    // Add a small delay to ensure the page has loaded
    const timer = setTimeout(trackVisit, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default VisitTracker;