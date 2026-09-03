import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { CountrySelect } from '../../components/ui/CountrySelect';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Camera, Save, CheckCircle, Bell, Globe, DollarSign } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [country, setCountry] = useState(profile?.country || 'India');
  const [currency, setCurrency] = useState(profile?.currency || 'INR');
  const [timezone, setTimezone] = useState(profile?.timezone || 'Asia/Kolkata');
  const [occupation, setOccupation] = useState(profile?.occupation || 'Professional');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(profile?.monthlyIncome ?? 0);
  const [savingsGoal, setSavingsGoal] = useState<number>(profile?.savingsGoal ?? 0);
  const [avatarUrl, setAvatarUrl] = useState<string>(profile?.avatarUrl || '');

  const [emailNotifications, setEmailNotifications] = useState(profile?.emailNotifications ?? true);
  const [pushNotifications, setPushNotifications] = useState(profile?.pushNotifications ?? true);
  const [weeklyReports, setWeeklyReports] = useState(profile?.weeklyReports ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setPhone(profile.phone || '');
      setCountry(profile.country || 'India');
      setCurrency(profile.currency || 'INR');
      setTimezone(profile.timezone || 'Asia/Kolkata');
      setOccupation(profile.occupation || 'Professional');
      setMonthlyIncome(profile.monthlyIncome ?? 0);
      setSavingsGoal(profile.savingsGoal ?? 0);
      setAvatarUrl(profile.avatarUrl || '');
      setEmailNotifications(profile.emailNotifications ?? true);
      setPushNotifications(profile.pushNotifications ?? true);
      setWeeklyReports(profile.weeklyReports ?? true);
    }
    if (user) {
      setFullName(user.fullName || '');
    }
  }, [profile, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const success = await updateProfile({
      fullName,
      phone,
      country,
      currency,
      timezone,
      occupation,
      monthlyIncome: Number(monthlyIncome),
      savingsGoal: Number(savingsGoal),
      avatarUrl,
      emailNotifications,
      pushNotifications,
      weeklyReports,
    });

    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-main dark:text-white">Account Settings</h1>
            <p className="text-text-secondary dark:text-gray-400 mt-1">Manage your profile details, financial preferences, and notifications.</p>
          </div>
          {saveSuccess && (
            <div className="flex items-center gap-2 px-4 py-2 bg-success/15 text-success rounded-full text-sm font-semibold animate-in fade-in">
              <CheckCircle size={18} />
              Profile saved successfully!
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Quick Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[24px] shadow-soft border border-gray-100 dark:border-gray-700 text-center flex flex-col items-center">
              <div className="relative group mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-primary">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-md cursor-pointer hover:bg-primary-hover transition-colors">
                  <Camera size={16} />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>

              <h2 className="text-xl font-bold text-text-main dark:text-white">{fullName || 'User'}</h2>
              <p className="text-xs text-text-secondary dark:text-gray-400 mt-0.5">{user?.email}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                {occupation || 'Member'}
              </span>

              <div className="w-full border-t border-gray-100 dark:border-gray-700 my-6"></div>

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary dark:text-gray-400">Account Status</span>
                  <span className="font-semibold text-success flex items-center gap-1">
                    <CheckCircle size={14} /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary dark:text-gray-400">Member Since</span>
                  <span className="font-medium text-text-main dark:text-gray-200">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Overview Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[24px] shadow-soft border border-gray-100 dark:border-gray-700 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <DollarSign size={18} />
                Financial Targets
              </div>
              <div className="space-y-3">
                <Input
                  label="Monthly Income Target"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  placeholder="65000"
                />
                <Input
                  label="Annual Savings Goal"
                  type="number"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(Number(e.target.value))}
                  placeholder="100000"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[24px] shadow-soft border border-gray-100 dark:border-gray-700 space-y-6">
              <div className="flex items-center gap-2 text-primary font-bold border-b border-gray-100 dark:border-gray-700 pb-4">
                <User size={20} />
                Personal Details
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
                <Input label="Email Address" value={user?.email || ''} disabled className="opacity-70 bg-gray-50 dark:bg-gray-900" />
                <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                <Input label="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Software Engineer" />
              </div>
            </div>

            {/* Regional Preferences */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[24px] shadow-soft border border-gray-100 dark:border-gray-700 space-y-6">
              <div className="flex items-center gap-2 text-primary font-bold border-b border-gray-100 dark:border-gray-700 pb-4">
                <Globe size={20} />
                Regional & Currency Preferences
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <CountrySelect value={country} onChange={setCountry} label="Country" />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-main dark:text-gray-200">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="px-4 py-3 bg-background dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main dark:text-gray-100"
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="AED">AED (د.إ) - UAE Dirham</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-main dark:text-gray-200">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="px-4 py-3 bg-background dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main dark:text-gray-100"
                  >
                    <option value="Asia/Kolkata">(UTC+05:30) New Delhi, Mumbai</option>
                    <option value="America/New_York">(UTC-05:00) Eastern Time (US)</option>
                    <option value="Europe/London">(UTC+00:00) London, Edinburgh</option>
                    <option value="Asia/Dubai">(UTC+04:00) Dubai, Abu Dhabi</option>
                    <option value="Asia/Singapore">(UTC+08:00) Singapore</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[24px] shadow-soft border border-gray-100 dark:border-gray-700 space-y-6">
              <div className="flex items-center gap-2 text-primary font-bold border-b border-gray-100 dark:border-gray-700 pb-4">
                <Bell size={20} />
                Notification Settings
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-text-main dark:text-gray-200">Email Notifications</p>
                    <p className="text-xs text-text-secondary dark:text-gray-400">Receive alerts for major budget thresholds and monthly summaries.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-text-main dark:text-gray-200">Push Notifications</p>
                    <p className="text-xs text-text-secondary dark:text-gray-400">Instant browser alerts for upcoming EMI due dates.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-text-main dark:text-gray-200">Weekly AI Digest</p>
                    <p className="text-xs text-text-secondary dark:text-gray-400">Automated financial health report and personalized debt optimization tips.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyReports}
                    onChange={(e) => setWeeklyReports(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
                  />
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end pt-2">
              <Button type="submit" isLoading={isSaving} className="px-8 gap-2">
                <Save size={18} />
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
