import React, { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

interface DashboardLayoutProps {
  children: ReactNode;
}

type TransitionState = 'entered' | 'exiting' | 'entering';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState<ReactNode>(children);
  const [transitionState, setTransitionState] = useState<TransitionState>('entered');
  const pendingChildren = useRef<ReactNode>(children);
  const timeoutRef = useRef<number | null>(null);
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === previousPath.current) {
      setDisplayChildren(children);
      setTransitionState('entered');
      return;
    }

    pendingChildren.current = children;
    previousPath.current = location.pathname;
    setTransitionState('exiting');

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setDisplayChildren(pendingChildren.current);
      setTransitionState('entering');
      timeoutRef.current = window.setTimeout(() => setTransitionState('entered'), 250);
    }, 180);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname, children]);

  const transitionClasses =
    transitionState === 'entered'
      ? 'opacity-100 translate-y-0'
      : transitionState === 'entering'
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 -translate-y-3 pointer-events-none';

  return (
    <div className="flex h-screen bg-background text-text-main font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className={`max-w-7xl mx-auto space-y-8 pb-12 transition-all duration-250 ease-out will-change-transform will-change-opacity ${transitionClasses}`}>
            {displayChildren}
          </div>
        </main>
      </div>
    </div>
  );
};
