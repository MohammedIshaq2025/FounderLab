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
  Database,
  UserX,
  Loader2,
} from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import { applyTheme } from '../theme';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showDeleteDataModal, setShowDeleteDataModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null); // 'data' | 'account' | null
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
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

  const handleDeleteData = async () => {
    setDeleteLoading('data');
    setDeleteError('');
    setDeleteSuccess('');
    try {
      const response = await api.post('/api/account/delete-data');
      const { deleted } = response.data;

      // Clear local caches
      localStorage.removeItem('founderlab_projects');
      localStorage.removeItem('founderlab_starred');

      setDeleteSuccess(
        `Deleted ${deleted.projects} project${deleted.projects !== 1 ? 's' : ''}, ` +
        `${deleted.messages} message${deleted.messages !== 1 ? 's' : ''}, and ` +
        `${deleted.documents} document${deleted.documents !== 1 ? 's' : ''}.`
      );
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Failed to delete data. Please try again.';
      setDeleteError(message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading('account');
    setDeleteError('');
    setDeleteSuccess('');
    try {
      await api.post('/api/account/delete');

      // Clear all local storage, preserve theme
      const currentTheme = localStorage.getItem('founderlab_theme');
      localStorage.clear();
      if (currentTheme) localStorage.setItem('founderlab_theme', currentTheme);

      // Sign out the client session
      await signOut();
      navigate('/landing', { replace: true });
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Failed to delete account. Please try again.';
      setDeleteError(message);
      setDeleteLoading(null);
    }
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
                    {referralLabels[referralSource] || referralSource || 'Not set'}
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

          {/* Status Messages */}
          {deleteError && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-[13px] text-red-600 dark:text-red-400">
              {deleteError}
            </div>
          )}
          {deleteSuccess && (
            <div className="px-4 py-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-[13px] text-emerald-600 dark:text-emerald-400">
              {deleteSuccess}
            </div>
          )}

          {/* Danger Zone */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h2 className="text-[13px] font-semibold text-red-400 uppercase tracking-widest">
                Danger Zone
              </h2>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-xl border border-red-200 dark:border-red-500/20 divide-y divide-red-100 dark:divide-red-500/10">
              {/* Delete Data */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Database className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                    <p className="text-[14px] font-medium text-stone-800 dark:text-stone-200">Delete All Data</p>
                  </div>
                  <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                    Permanently delete all your projects, messages, and documents from the server. Your account will remain active.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteDataModal(true)}
                  disabled={deleteLoading !== null}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {deleteLoading === 'data' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Delete Data
                </button>
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <UserX className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                    <p className="text-[14px] font-medium text-stone-800 dark:text-stone-200">Delete Account</p>
                  </div>
                  <p className="text-[13px] text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                    Permanently delete your account and all associated data. This action is irreversible — you will need to create a new account to use FounderLab again.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteAccountModal(true)}
                  disabled={deleteLoading !== null}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {deleteLoading === 'account' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
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
        title="Delete All Data"
        message={
          <>
            This will permanently delete <span className="font-semibold text-stone-700 dark:text-stone-300">all your projects, messages, and documents</span> from the server. Your account will remain active so you can start fresh. This cannot be undone.
          </>
        }
        confirmText="Delete All Data"
        cancelText="Cancel"
        variant="destructive"
        icon="trash"
      />

      <ConfirmationModal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message={
          <>
            This will permanently delete <span className="font-semibold text-stone-700 dark:text-stone-300">your account and all associated data</span> (projects, messages, documents). You will be signed out and will need to create a new account to use FounderLab again. This cannot be undone.
          </>
        }
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="destructive"
        icon="warning"
      />
    </div>
  );
}

export default Settings;
