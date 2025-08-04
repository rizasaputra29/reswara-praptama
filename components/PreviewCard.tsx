// src/components/admin/PreviewCard.tsx
import React from 'react';

interface PreviewCardProps {
  title: string;
  children: React.ReactNode;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
      {children}
    </div>
  </div>
);