import React from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-card rounded-2xl shadow-soft border border-gray-100 p-6 ${className}`}>
      {children}
    </div>
  );
};
