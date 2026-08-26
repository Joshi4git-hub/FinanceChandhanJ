import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange auth code or hash if present in URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (session) {
          await refreshProfile();
          navigate('/dashboard', { replace: true });
        } else {
          // Listen for onAuthStateChange in case session is being processed
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: AuthChangeEvent, currentSession: Session | null) => {
              if (event === 'SIGNED_IN' && currentSession) {
                await refreshProfile();
                subscription.unsubscribe();
                navigate('/dashboard', { replace: true });
              }
            }
          );

          // Timeout fallback
          setTimeout(() => {
            subscription.unsubscribe();
            navigate('/dashboard', { replace: true });
          }, 3000);
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err?.message || 'Authentication could not be completed.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3500);
      }
    };

    handleAuthCallback();
  }, [navigate, refreshProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-sm w-full text-center">
        {error ? (
          <div className="flex flex-col items-center gap-3 text-danger">
            <AlertCircle className="w-10 h-10 text-danger" />
            <p className="font-semibold text-sm">{error}</p>
            <p className="text-xs text-text-secondary">Redirecting to login...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div>
              <h3 className="font-bold text-lg text-text-main dark:text-white">Authenticating</h3>
              <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">
                Completing Google Sign-In and loading your profile...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
