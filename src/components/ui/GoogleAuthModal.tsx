import React, { useState } from 'react';
import { Modal } from './Modal';
import { Plus, ArrowRight, Check } from 'lucide-react';

interface GoogleAccount {
  email: string;
  name: string;
  avatarUrl: string;
  googleId: string;
}

const PRESET_ACCOUNTS: GoogleAccount[] = [
  {
    email: 'john.doe@gmail.com',
    name: 'John Doe',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    googleId: '1092837465918237',
  },
  {
    email: 'alex.morgan@gmail.com',
    name: 'Alex Morgan',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    googleId: '1092837465918238',
  },
];

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string, googleId: string, avatarUrl?: string) => Promise<void>;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<string>(PRESET_ACCOUNTS[0].email);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    setIsSubmitting(true);
    let targetEmail = selectedEmail;
    let targetName = 'Google User';
    let targetId = `g_${Date.now()}`;
    let avatarUrl: string | undefined = undefined;

    if (isCustomMode) {
      targetEmail = customEmail || 'user.google@gmail.com';
      targetName = customName || targetEmail.split('@')[0];
    } else {
      const found = PRESET_ACCOUNTS.find((a) => a.email === selectedEmail);
      if (found) {
        targetName = found.name;
        targetId = found.googleId;
        avatarUrl = found.avatarUrl;
      }
    }

    await onSelectAccount(targetEmail, targetName, targetId, avatarUrl);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-6">
        {/* Google Header */}
        <div className="flex flex-col items-center text-center pt-2">
          <svg width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mb-2">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <h3 className="text-xl font-bold text-text-main dark:text-white">Sign in with Google</h3>
          <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">Choose an account to continue to Spendora AI</p>
        </div>

        {/* Account Selection */}
        {!isCustomMode ? (
          <div className="space-y-3">
            {PRESET_ACCOUNTS.map((acc) => {
              const isSelected = selectedEmail === acc.email;
              return (
                <div
                  key={acc.email}
                  onClick={() => setSelectedEmail(acc.email)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={acc.avatarUrl} alt={acc.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                    <div>
                      <p className="text-sm font-semibold text-text-main dark:text-white">{acc.name}</p>
                      <p className="text-xs text-text-secondary dark:text-gray-400">{acc.email}</p>
                    </div>
                  </div>
                  {isSelected && <Check size={18} className="text-primary" />}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => setIsCustomMode(true)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-primary text-text-secondary dark:text-gray-300 hover:text-primary transition-colors text-sm font-medium"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-text-secondary dark:text-gray-300">
                <Plus size={18} />
              </div>
              Use another Google account
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary dark:text-gray-300 mb-1 block">Google Email</label>
              <input
                type="email"
                placeholder="your.email@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 bg-background dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:border-primary text-text-main dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary dark:text-gray-300 mb-1 block">Full Name</label>
              <input
                type="text"
                placeholder="Your Full Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-4 py-3 bg-background dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:border-primary text-text-main dark:white"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsCustomMode(false)}
              className="text-xs font-medium text-primary hover:underline"
            >
              ← Back to saved accounts
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleContinue}
            disabled={isSubmitting}
            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl transition-all shadow-soft flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Authenticating with Google...
              </span>
            ) : (
              <>
                Continue to Spendora <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
