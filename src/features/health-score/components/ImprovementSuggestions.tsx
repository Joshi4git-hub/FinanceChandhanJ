import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface ImprovementSuggestionsProps {
  suggestions: string[];
}

export const ImprovementSuggestions: React.FC<ImprovementSuggestionsProps> = ({ suggestions }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[32px] p-8 shadow-sm text-white relative overflow-hidden mt-6">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
            <Lightbulb size={24} className="text-amber-300" />
          </div>
          <h3 className="text-xl font-bold">Action Plan</h3>
        </div>

        <ul className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <ArrowRight size={18} className="text-primary-light shrink-0 mt-0.5" />
              <span className="text-white/90 leading-relaxed text-sm">{suggestion}</span>
            </li>
          ))}
        </ul>

        {/* Future Module 9 placeholder text */}
        <p className="text-xs text-white/40 mt-6 text-center italic">
          AI insights coming soon...
        </p>
      </div>
    </div>
  );
};
