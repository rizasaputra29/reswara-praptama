// components/VisitTracker.tsx
"use client";

import { useEffect } from 'react';

const VisitTracker = () => {
  useEffect(() => {
    // This is a direct, simplified call to the API.
    fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        if (response.ok) {
          console.log("Visit tracked successfully!");
          // Store in session storage on successful call
          sessionStorage.setItem('visitTracked', 'true');
        } else {
          console.error("Failed to track visit. Server responded with an error.");
        }
      })
      .catch(error => {
        console.error("Failed to track visit. Network error:", error);
      });
  }, []);

  return null;
};

export default VisitTracker;