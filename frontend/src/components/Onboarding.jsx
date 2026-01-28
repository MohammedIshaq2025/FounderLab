import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  HelpCircle,
  BookOpen,
  Code,
  Terminal,
  Rocket,
  GraduationCap,
  Flame,
  Users,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

/* ─── Data ──────────────────────────────────────────────────────── */

const userRoles = [
  { id: 'founder', label: 'Founder', icon: Rocket },
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'enthusiast', label: 'Enthusiast', icon: Flame },
  { id: 'project-manager', label: 'Project Manager', icon: Users },
  { id: 'other', label: 'Other', icon: SlidersHorizontal },
];

const techLevels = [
  { id: 'none', label: 'No tech background', description: 'New to technology', icon: HelpCircle },
  { id: 'basic', label: 'Basic understanding', description: 'Know the fundamentals', icon: BookOpen },
  { id: 'intermediate', label: 'Intermediate', description: 'Build things regularly', icon: Code },
  { id: 'senior', label: 'Senior / advanced', description: 'Deep technical expertise', icon: Terminal },
];

const referralSources = [
  'Twitter / X',
  'LinkedIn',
  'YouTube',
  'Friend or colleague',
  'Search engine',
  'Other',
];

const TOTAL_STEPS = 4;

/* ─── Logo Component ────────────────────────────────────────────── */

function FounderLabLogo({ size = 'default' }) {
  const isLarge = size === 'large';
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${
          isLarge ? 'w-12 h-12 rounded-[14px]' : 'w-8 h-8 rounded-[10px]'
        } bg-stone-800 dark:bg-stone-700 flex items-center justify-center`}
      >
        <span className={`text-white font-bold ${isLarge ? 'text-lg' : 'text-sm'}`}>F</span>
      </div>
      {!isLarge && (
        <span className="text-[15px] font-semibold text-stone-800 dark:text-stone-200 tracking-tight">
          Founder Lab
        </span>
      )}
    </div>
  );
}

/* ─── Staggered Item Wrapper ────────────────────────────────────── */

function StaggerItem({ children, index, className = '' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 60 + index * 70);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${className} ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-3'
      }`}
    >
      {children}
    </div>
  );
}

/* ─── Step Content Components ───────────────────────────────────── */

function WelcomeStep({ onNext }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div
        className={`flex flex-col items-center text-center transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Logo */}
        <div className="w-16 h-16 bg-stone-800 dark:bg-stone-700 rounded-[18px] flex items-center justify-center mb-8 shadow-lg shadow-stone-900/10 dark:shadow-black/30">
          <span className="text-white font-bold text-2xl">F</span>
        </div>

        {/* Heading */}
        <h1 className="text-[36px] font-bold tracking-tight text-stone-950 dark:text-stone-50 mb-3 leading-[1.1]">
          Welcome to Founder Lab
        </h1>
        <p className="text-[15px] text-stone-500 dark:text-stone-400 mb-10 max-w-sm leading-relaxed">
          Transform your startup ideas into comprehensive,
          investor-ready PRDs through guided AI conversations.
        </p>

        {/* CTA */}
        <button
          onClick={onNext}
          className="group relative px-8 py-3.5 bg-terra-500 text-white rounded-xl text-sm font-semibold
                     hover:bg-terra-600 active:scale-[0.97] transition-all duration-200
                     shadow-lg shadow-terra-500/20 hover:shadow-xl hover:shadow-terra-500/30"
        >
          <span className="flex items-center gap-2">
            Get Started
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </button>
      </div>
    </div>
  );
}

function UserRoleStep({ userRole, setUserRole, onNext, onBack }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <div className="px-6 py-5 sm:px-10 sm:py-6">
        <FounderLabLogo />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 pb-24 max-w-xl mx-auto w-full">
        <StaggerItem index={0}>
          <p className="text-[11px] font-semibold text-terra-500 uppercase tracking-[0.15em] mb-3">
            Set up your workspace
          </p>
        </StaggerItem>

        <StaggerItem index={1}>
          <h1 className="text-[30px] font-bold tracking-tight text-stone-950 dark:text-stone-50 mb-2 leading-tight">
            Tell us about you
          </h1>
        </StaggerItem>

        <StaggerItem index={2}>
          <p className="text-[15px] text-stone-500 dark:text-stone-400 mb-10">
            This will help us personalise your experience.
          </p>
        </StaggerItem>

        {/* User Role Pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          {userRoles.map((type, i) => {
            const Icon = type.icon;
            const selected = userRole === type.id;
            return (
              <StaggerItem key={type.id} index={i + 3}>
                <button
                  onClick={() => setUserRole(type.id)}
                  className={`group flex items-center gap-2.5 pl-3 pr-5 py-2.5 rounded-full border transition-all duration-200
                    hover:scale-[1.02] active:scale-[0.98] ${
                    selected
                      ? 'border-terra-500 bg-terra-50 dark:bg-terra-500/10 shadow-sm shadow-terra-500/10'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                      selected
                        ? 'bg-terra-500 text-white'
                        : 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 group-hover:bg-stone-200 dark:group-hover:bg-stone-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[14px] font-medium transition-colors duration-200 ${
                      selected
                        ? 'text-terra-600 dark:text-terra-400'
                        : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {type.label}
                  </span>
                </button>
              </StaggerItem>
            );
          })}
        </div>

        {/* Actions */}
        <StaggerItem index={9} className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!userRole}
            className="group px-6 py-2.5 bg-stone-800 dark:bg-stone-700 text-white rounded-xl text-sm font-semibold
                       hover:bg-stone-900 dark:hover:bg-stone-600 active:scale-[0.97] transition-all duration-200
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-stone-800 disabled:active:scale-100"
          >
            <span className="flex items-center gap-2">
              Continue
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </button>
        </StaggerItem>
      </div>
    </div>
  );
}

function TechLevelStep({ techLevel, setTechLevel, onNext, onBack }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <div className="px-6 py-5 sm:px-10 sm:py-6">
        <FounderLabLogo />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 pb-24 max-w-xl mx-auto w-full">
        <StaggerItem index={0}>
          <p className="text-[11px] font-semibold text-terra-500 uppercase tracking-[0.15em] mb-3">
            Your background
          </p>
        </StaggerItem>

        <StaggerItem index={1}>
          <h1 className="text-[30px] font-bold tracking-tight text-stone-950 dark:text-stone-50 mb-2 leading-tight">
            What's your technical level?
          </h1>
        </StaggerItem>

        <StaggerItem index={2}>
          <p className="text-[15px] text-stone-500 dark:text-stone-400 mb-10">
            This helps us tailor the AI experience for you.
          </p>
        </StaggerItem>

        {/* Tech Level Cards */}
        <div className="grid grid-cols-2 gap-3 mb-12">
          {techLevels.map((level, i) => {
            const Icon = level.icon;
            const selected = techLevel === level.id;
            return (
              <StaggerItem key={level.id} index={i + 3}>
                <button
                  onClick={() => setTechLevel(level.id)}
                  className={`w-full flex flex-col items-center gap-2 p-5 rounded-xl border transition-all duration-200
                    hover:scale-[1.02] active:scale-[0.98] text-center ${
                    selected
                      ? 'border-terra-500 bg-terra-50 dark:bg-terra-500/10 ring-2 ring-terra-500/20 shadow-sm'
                      : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-sm'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 mb-0.5 ${
                      selected
                        ? 'bg-terra-500 text-white'
                        : 'bg-stone-100 dark:bg-stone-700 text-stone-400 dark:text-stone-400'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
                  </div>
                  <span
                    className={`text-[14px] font-medium transition-colors duration-200 ${
                      selected ? 'text-terra-600 dark:text-terra-400' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {level.label}
                  </span>
                  <span className="text-[12px] text-stone-400 dark:text-stone-500">
                    {level.description}
                  </span>
                </button>
              </StaggerItem>
            );
          })}
        </div>

        {/* Actions */}
        <StaggerItem index={7} className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!techLevel}
            className="group px-6 py-2.5 bg-stone-800 dark:bg-stone-700 text-white rounded-xl text-sm font-semibold
                       hover:bg-stone-900 dark:hover:bg-stone-600 active:scale-[0.97] transition-all duration-200
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-stone-800 disabled:active:scale-100"
          >
            <span className="flex items-center gap-2">
              Continue
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </button>
        </StaggerItem>
      </div>
    </div>
  );
}

function ReferralStep({ referralSource, setReferralSource, onFinish, onBack }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <div className="px-6 py-5 sm:px-10 sm:py-6">
        <FounderLabLogo />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 pb-24 max-w-xl mx-auto w-full">
        <StaggerItem index={0}>
          <p className="text-[11px] font-semibold text-terra-500 uppercase tracking-[0.15em] mb-3">
            One last thing
          </p>
        </StaggerItem>

        <StaggerItem index={1}>
          <h1 className="text-[30px] font-bold tracking-tight text-stone-950 dark:text-stone-50 mb-2 leading-tight">
            How did you find us?
          </h1>
        </StaggerItem>

        <StaggerItem index={2}>
          <p className="text-[15px] text-stone-500 dark:text-stone-400 mb-10">
            Help us understand where to reach more founders.
          </p>
        </StaggerItem>

        {/* Referral Sources */}
        <div className="space-y-2 mb-12">
          {referralSources.map((source, i) => {
            const selected = referralSource === source;
            return (
              <StaggerItem key={source} index={i + 3}>
                <button
                  onClick={() => setReferralSource(source)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all duration-200
                    hover:scale-[1.005] active:scale-[0.995] text-left ${
                    selected
                      ? 'border-terra-500 bg-terra-50 dark:bg-terra-500/10 ring-2 ring-terra-500/20 shadow-sm'
                      : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      selected
                        ? 'border-terra-500 bg-terra-500'
                        : 'border-stone-300 dark:border-stone-600'
                    }`}
                  >
                    {selected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className={`text-[14px] font-medium transition-colors duration-200 ${
                      selected ? 'text-terra-600 dark:text-terra-400' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {source}
                  </span>
                </button>
              </StaggerItem>
            );
          })}
        </div>

        {/* Actions */}
        <StaggerItem index={9} className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            onClick={onFinish}
            disabled={!referralSource}
            className="group px-7 py-2.5 bg-terra-500 text-white rounded-xl text-sm font-semibold
                       hover:bg-terra-600 active:scale-[0.97] transition-all duration-200
                       shadow-lg shadow-terra-500/20 hover:shadow-xl hover:shadow-terra-500/25
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-terra-500 disabled:active:scale-100"
          >
            <span className="flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </button>
        </StaggerItem>
      </div>
    </div>
  );
}

/* ─── Main Onboarding Component ─────────────────────────────────── */

function Onboarding() {
  const [step, setStep] = useState(1);
  const [userRole, setUserRole] = useState('');
  const [techLevel, setTechLevel] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

  const transition = useCallback((fn) => {
    setTransitioning(true);
    setTimeout(() => {
      fn();
      setTimeout(() => setTransitioning(false), 50);
    }, 250);
  }, []);

  const goForward = useCallback(() => {
    transition(() => setStep((s) => s + 1));
  }, [transition]);

  const goBack = useCallback(() => {
    transition(() => setStep((s) => s - 1));
  }, [transition]);

  const handleFinish = useCallback(async () => {
    try {
      await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          user_role: userRole,
          tech_level: techLevel,
          referral_source: referralSource,
        },
      });
    } catch (err) {
      console.error('Failed to save onboarding data:', err);
    }
    navigate('/');
  }, [userRole, techLevel, referralSource, navigate]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-terra-500/[0.03] dark:bg-terra-500/[0.04] blur-[120px]" />
        <div className="absolute -bottom-[30%] -left-[20%] w-[50%] h-[50%] rounded-full bg-stone-400/[0.05] dark:bg-stone-500/[0.03] blur-[100px]" />
      </div>

      {/* Step content */}
      <div
        className={`relative z-10 transition-all duration-300 ease-out ${
          transitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        {step === 1 && <WelcomeStep onNext={goForward} />}
        {step === 2 && (
          <UserRoleStep
            userRole={userRole}
            setUserRole={setUserRole}
            onNext={goForward}
            onBack={goBack}
          />
        )}
        {step === 3 && (
          <TechLevelStep
            techLevel={techLevel}
            setTechLevel={setTechLevel}
            onNext={goForward}
            onBack={goBack}
          />
        )}
        {step === 4 && (
          <ReferralStep
            referralSource={referralSource}
            setReferralSource={setReferralSource}
            onFinish={handleFinish}
            onBack={goBack}
          />
        )}
      </div>

      {/* Progress Dots — fixed bottom */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((dot) => (
          <div
            key={dot}
            className={`rounded-full transition-all duration-500 ease-out ${
              dot === step
                ? 'w-6 h-2 bg-terra-500'
                : dot < step
                ? 'w-2 h-2 bg-terra-400/50'
                : 'w-2 h-2 bg-stone-300 dark:bg-stone-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Onboarding;
