import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import type { BudgetAlert } from '../../hooks/useBudgetAlerts';

interface BudgetAlertsBannerProps {
  alerts: BudgetAlert[];
}

export const BudgetAlertsBanner: React.FC<BudgetAlertsBannerProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  // Render the most severe alert first (DANGER > WARNING)
  // For simplicity, we just render the top overall alert if present, or the top category alert.
  // In a real app, you might stack them or use a carousel.
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.status === 'DANGER' && b.status !== 'DANGER') return -1;
    if (b.status === 'DANGER' && a.status !== 'DANGER') return 1;
    return 0;
  });

  const topAlert = sortedAlerts[0];
  const isDanger = topAlert.status === 'DANGER';

  return (
    <div className={`rounded-2xl p-4 flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-2 ${
      isDanger ? 'bg-danger/10 border border-danger/20 text-danger' : 'bg-warning/10 border border-warning/20 text-warning'
    }`}>
      <div className="mt-0.5">
        {isDanger ? <AlertCircle size={20} /> : <AlertTriangle size={20} />}
      </div>
      <div>
        <h4 className="font-semibold text-sm">Budget Alert</h4>
        <p className="text-sm mt-0.5 opacity-90">{topAlert.message}</p>
        
        {alerts.length > 1 && (
          <p className="text-xs mt-2 opacity-75 font-medium">
            + {alerts.length - 1} other category {alerts.length - 1 === 1 ? 'alert' : 'alerts'}
          </p>
        )}
      </div>
    </div>
  );
};
