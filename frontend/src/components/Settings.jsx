import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Palette,
  Trash2,
  AlertTriangle,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import { applyTheme } from '../theme';
import { useAuth } from '../context/AuthContext';

function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showDeleteDataModal, setShowDeleteDataModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem('founderlab_theme') || 'light'
  );

  const techLevel = user?.user_metadata?.tech_level || '';
  const referralSource = user?.user_metadata?.referral_source || '';

  const techLabels = {
    none: 'No tech background',
    basic: 'Basic understanding',
    intermediate: 'Intermediate developer',
    senior: 'Senior / advanced',
  };

  const referralLabels = {
    twitter: 'Twitter / X',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    friend: 'Friend / colleague',
    search: 'Search engine',
    other: 'Other',
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const handleThemeChange = (value) => {
    setTheme(value);
    localStorage.setItem('founderlab_theme', value);
    applyTheme();
  };

  const handleDeleteData = () => {
    localStorage.removeItem('founderlab_projects');
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    const currentTheme = localStorage.getItem('founderlab_theme');
    localStorage.clear();
    if (currentTheme) localStorage.setItem('founderlab_theme', currentTheme);
    await signOut();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex-shrink-0">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-stone-600 dark:text-stone-400" />
          </button>
          <h1 className="text-[15px] font-semibold text-stone-950 dark:text-stone-100">Settings</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
          {/* Account Details */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              <h2 className="text-[13px] font-semibold text-stone-400 uppercase tracking-widest">
                Account Details
              </h2>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[14px] font-medium text-stone-800 dark:text-stone-200">Display Name</p>
                  <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {user?.user_metadata?.full_name || 'Founder'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[14px] font-medium text-stone-800 dark:text-stone-200">Email</p>
                  <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {user?.email || 'Not set'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[14px] font-medium text-stone-800 dark:text-stone-200">Technical Level</p>
                  <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {techLabels[techLevel] || 'Not set'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[14px] font-medium text-stone-800 dark:text-stone-200">Referral Source</p>
                  <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {referralLabels[referralSource] || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Theme */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              <h2 className="text-[13px] font-semibold text-stone-400 uppercase tracking-widest">
                Theme
              </h2>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-1.5 flex gap-1">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleThemeChange(opt.value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Danger Zone */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h2 className="text-[13px] font-semibold text-red-400 uppercase tracking-widest">
                Danger Zone
              </h2>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-xl border border-red-200 dark:border-red-500/20 divide-y divide-red-100 dark:divide-red-500/10">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[14px] font-medium text-stone-800 dark:text-stone-200">Delete Account Data</p>
                  <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Remove all locally cached project data
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteDataModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Data
                </button>
              </div>

              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[14px] font-medium text-stone-800 dark:text-stone-200">Delete Account</p>
                  <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Permanently reset all settings and preferences
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteAccountModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteDataModal}
        onClose={() => setShowDeleteDataModal(false)}
        onConfirm={handleDeleteData}
        title="Delete Account Data"
        message="This will remove all locally cached project data. Your projects stored on the server will not be affected."
        confirmText="Delete Data"
        cancelText="Cancel"
        variant="destructive"
        icon="trash"
      />

      <ConfirmationModal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="This will permanently reset all your settings, preferences, and local data. You will be redirected to the onboarding screen."
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="destructive"
        icon="warning"
      />
    </div>
  );
}

export default Settings;
