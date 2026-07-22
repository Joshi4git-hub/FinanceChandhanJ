import React from 'react';
import { Activity } from 'lucide-react';

interface ScoreGaugeCardProps {
  score: number;
}

export const ScoreGaugeCard: React.FC<ScoreGaugeCardProps> = ({ score }) => {
  // Determine color based on overall score
  let colorClass = 'text-danger';
  let bgClass = 'from-danger/20 to-danger/5';
  let label = 'Needs Work';

  if (score >= 80) {
    colorClass = 'text-success';
    bgClass = 'from-success/20 to-success/5';
    label = 'Excellent';
  } else if (score >= 60) {
    colorClass = 'text-primary';
    bgClass = 'from-primary/20 to-primary/5';
    label = 'Good';
  } else if (score >= 40) {
    colorClass = 'text-warning';
    bgClass = 'from-warning/20 to-warning/5';
    label = 'Fair';
  }

  // Calculate SVG stroke dasharray (Circle circumference is 2 * pi * r)
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`bg-gradient-to-b ${bgClass} rounded-[32px] p-8 border border-white/50 shadow-sm flex flex-col items-center text-center`}>
      <div className="flex items-center gap-2 mb-8">
        <Activity size={24} className={colorClass} />
        <h3 className="text-xl font-bold text-text-main">Health Score</h3>
      </div>

      <div className="relative flex items-center justify-center w-48 h-48 mb-6">
        {/* Background track */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-200"
          />
          {/* Animated progress */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-out`}
          />
        </svg>
        
        {/* Inner Text */}
        <div className="absolute flex flex-col items-center">
          <span className={`text-5xl font-black tracking-tight ${colorClass}`}>
            {score}
          </span>
          <span className="text-sm font-semibold text-text-secondary mt-1 uppercase tracking-widest">
            / 100
          </span>
        </div>
      </div>

      <p className="text-lg font-semibold text-text-main">{label}</p>
      <p className="text-sm text-text-secondary mt-2 max-w-[200px]">
        Based on your savings, debt, and budget habits.
      </p>
    </div>
  );
};
