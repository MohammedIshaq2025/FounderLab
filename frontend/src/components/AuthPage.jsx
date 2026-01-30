import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

/* ─── Stagger Animation (shared pattern with Onboarding) ────────── */

function Reveal({ children, index = 0, className = '' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80 + index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`transition-all duration-600 ease-out ${className} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
}

/* ─── Google Icon (inline SVG) ──────────────────────────────────── */

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ─── Email Confirmation Illustration ──────────────────────────── */

function ConfirmationView({ email, onBackToSignIn }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Orchestrated reveal: 0→icon, 1→check, 2→text, 3→email card, 4→subtext, 5→CTA
    const timers = [
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 600),
      setTimeout(() => setStage(3), 900),
      setTimeout(() => setStage(4), 1150),
      setTimeout(() => setStage(5), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      {/* Animated icon cluster */}
      <div className="relative w-24 h-24 mb-10">
        {/* Outer pulse ring */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(232,97,60,0.08) 0%, transparent 70%)',
            transform: stage >= 1 ? 'scale(1.6)' : 'scale(0.8)',
            opacity: stage >= 1 ? 1 : 0,
          }}
        />

        {/* Inner glow ring */}
        <div
          className="absolute inset-2 rounded-full transition-all duration-700 ease-out delay-100"
          style={{
            background: 'radial-gradient(circle, rgba(232,97,60,0.05) 0%, transparent 70%)',
            transform: stage >= 1 ? 'scale(1.3)' : 'scale(0.9)',
            opacity: stage >= 1 ? 1 : 0,
          }}
        />

        {/* Envelope body */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out"
          style={{
            transform: stage >= 1 ? 'scale(1) translateY(0)' : 'scale(0.6) translateY(12px)',
            opacity: stage >= 1 ? 1 : 0,
          }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm"
          >
            {/* Envelope back */}
            <rect
              x="6" y="16" width="44" height="30" rx="4"
              className="fill-white dark:fill-stone-800 stroke-stone-200 dark:stroke-stone-700"
              strokeWidth="1.5"
            />

            {/* Envelope flap — folds open */}
            <path
              d="M6 20 L28 34 L50 20"
              className="stroke-stone-300 dark:stroke-stone-600"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transformOrigin: '28px 20px',
                transform: stage >= 2 ? 'scaleY(0.85)' : 'scaleY(1)',
                opacity: stage >= 1 ? 1 : 0,
              }}
            />

            {/* Letter emerging */}
            <rect
              x="14" y="10" width="28" height="24" rx="3"
              className="fill-stone-50 dark:fill-stone-750 stroke-stone-200 dark:stroke-stone-600"
              strokeWidth="1"
              style={{
                transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: stage >= 2 ? 'translateY(-6px)' : 'translateY(8px)',
                opacity: stage >= 2 ? 1 : 0,
              }}
            />

            {/* Checkmark on letter — stroke draw animation */}
            <path
              d="M22 22 L26 26 L34 18"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                stroke: '#E8613C',
                strokeDasharray: 20,
                strokeDashoffset: stage >= 2 ? 0 : 20,
                transition: 'stroke-dashoffset 0.6s cubic-bezier(0.65, 0, 0.35, 1) 0.3s',
                transform: stage >= 2 ? 'translateY(-6px)' : 'translateY(8px)',
              }}
            />
          </svg>
        </div>

        {/* Sparkle accents */}
        {[
          { x: '8%', y: '15%', delay: '0.8s', size: 3 },
          { x: '82%', y: '10%', delay: '1s', size: 2.5 },
          { x: '90%', y: '65%', delay: '1.2s', size: 2 },
        ].map((spark, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-terra-500"
            style={{
              left: spark.x,
              top: spark.y,
              width: spark.size * 2,
              height: spark.size * 2,
              opacity: stage >= 2 ? 0.6 : 0,
              transform: stage >= 2 ? 'scale(1)' : 'scale(0)',
              transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${spark.delay}`,
            }}
          />
        ))}
      </div>

      {/* Heading */}
      <h1
        className="text-[28px] font-bold tracking-tight text-stone-950 dark:text-stone-50 mb-3 transition-all duration-600 ease-out"
        style={{
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? 'translateY(0)' : 'translateY(12px)',
        }}
      >
        Check your email
      </h1>

      <p
        className="text-[15px] text-stone-500 dark:text-stone-400 leading-relaxed mb-5 max-w-xs transition-all duration-600 ease-out"
        style={{
          opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? 'translateY(0)' : 'translateY(10px)',
          transitionDelay: '80ms',
        }}
      >
        We've sent a confirmation link to
      </p>

      {/* Email card */}
      <div
        className="mb-6 px-5 py-3 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-sm transition-all duration-600 ease-out"
        style={{
          opacity: stage >= 4 ? 1 : 0,
          transform: stage >= 4 ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-terra-50 dark:bg-terra-500/10 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-terra-500" />
          </div>
          <span className="text-[15px] font-semibold text-stone-800 dark:text-stone-200">
            {email}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <p
        className="text-[13px] text-stone-400 dark:text-stone-500 mb-8 max-w-[280px] leading-relaxed transition-all duration-600 ease-out"
        style={{
          opacity: stage >= 4 ? 1 : 0,
          transform: stage >= 4 ? 'translateY(0)' : 'translateY(8px)',
          transitionDelay: '80ms',
        }}
      >
        Click the link in the email to verify your account.
        Once confirmed, you'll be able to sign in and start building.
      </p>

      {/* CTA */}
      <button
        onClick={onBackToSignIn}
        className="group text-sm font-semibold text-rose-600 hover:text-rose-700 transition-all duration-200 flex items-center gap-1.5"
        style={{
          opacity: stage >= 5 ? 1 : 0,
          transform: stage >= 5 ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, color 0.2s',
        }}
      >
        Back to Sign In
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

/* ─── Phase Step Icons ──────────────────────────────────────────── */

function IdeationIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v1m0 18v1m9-10h1M2 12h1m15.5-6.5l.7.7M5.8 18.2l-.7.7m12.1.7l.7-.7M5.1 5.8l-.7-.7" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function FeaturesIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ArchitectureIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 7v4m0 0l-5 6m5-6l5 6" />
    </svg>
  );
}

function GenerateIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
      <path d="M14 2v6h6" />
      <path d="M9 15h6m-6-3h6" />
    </svg>
  );
}

function ExportIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
  );
}

/* ─── Feature Flow Right Panel ──────────────────────────────────── */

const FLOW_STEPS = [
  {
    id: 1,
    name: 'Ideation',
    description: 'Share your vision with our AI coach',
    Icon: IdeationIcon,
  },
  {
    id: 2,
    name: 'Features',
    description: 'Define and prioritize what matters',
    Icon: FeaturesIcon,
  },
  {
    id: 3,
    name: 'Architecture',
    description: 'Visualize your product structure',
    Icon: ArchitectureIcon,
  },
  {
    id: 4,
    name: 'Generate',
    description: 'AI creates your complete PRD',
    Icon: GenerateIcon,
  },
  {
    id: 5,
    name: 'Export',
    description: 'Download for Cursor, Claude & more',
    Icon: ExportIcon,
  },
];

function VisualPanel() {
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % FLOW_STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex relative w-full h-full overflow-hidden rounded-2xl">
      {/* Deep charcoal background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, #1A1816 0%, #12100F 100%)',
        }}
      />

      {/* Subtle warm glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 80% 10%, rgba(136,19,55,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 20% 90%, rgba(136,19,55,0.06) 0%, transparent 50%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col w-full h-full px-10 xl:px-14 py-10">
        {/* Header */}
        <div
          className="mb-6 transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <p className="text-rose-400 text-[10px] font-semibold tracking-[0.25em] uppercase mb-2">
            The Process
          </p>
          <h2 className="text-white text-[26px] xl:text-[28px] font-semibold tracking-tight leading-[1.2]">
            Five steps to your PRD
          </h2>
        </div>

        {/* Time stat */}
        <div
          className="flex items-center gap-3 mb-6 pb-5 border-b border-white/[0.08] transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transitionDelay: '100ms',
          }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08]">
            <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[24px] font-semibold text-white tracking-tight">30</span>
              <span className="text-[13px] text-white/60 font-medium">min</span>
            </div>
            <p className="text-[11px] text-white/40 -mt-0.5">average completion</p>
          </div>
        </div>

        {/* Flow Steps */}
        <div className="relative flex-1 flex flex-col justify-center">
          {/* Vertical connecting line */}
          <div className="absolute left-[15px] top-6 bottom-6 w-px bg-white/[0.08]" />

          {/* Steps */}
          <div className="space-y-0">
            {FLOW_STEPS.map((step, index) => {
              const isActive = index === activeStep;
              const { Icon } = step;

              return (
                <div
                  key={step.id}
                  className="relative flex items-center gap-4 py-[13px] transition-all duration-500"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(-16px)',
                    transitionDelay: `${200 + index * 80}ms`,
                  }}
                >
                  {/* Step number badge with pulse animation */}
                  <div className="relative flex-shrink-0 z-10">
                    {/* Pulse ring - only shows on active */}
                    <div
                      className="absolute inset-0 rounded-lg transition-opacity duration-300"
                      style={{
                        opacity: isActive ? 1 : 0,
                        background: 'rgba(244, 63, 94, 0.15)',
                        animation: isActive ? 'stepPulse 2s ease-in-out infinite' : 'none',
                      }}
                    />
                    <div
                      className={`relative w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-rose-500/25 text-rose-300 border border-rose-400/50'
                          : 'bg-white/[0.06] text-white/80 border border-white/[0.12]'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 transition-all duration-300 ${
                      isActive ? 'text-rose-300' : 'text-white/70'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </div>

                  {/* Text content - always readable */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium tracking-tight text-white">
                      {step.name}
                    </p>
                    <p className="text-[12px] mt-0.5 text-white/50 truncate">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom tagline */}
        <div
          className="mt-auto pt-5 transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transitionDelay: '600ms',
          }}
        >
          <p className="text-[11px] text-white/30 font-medium">
            AI-guided • Export-ready • Developer-friendly
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes stepPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.15);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Auth Form Component ───────────────────────────────────────── */

function AuthPage() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'confirmation'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formKey, setFormKey] = useState(0);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const switchMode = (newMode) => {
    setMode(newMode);
    setShowPassword(false);
    setPassword('');
    setError('');
    setFormKey((k) => k + 1); // reset stagger animations
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (signUpError) throw signUpError;
        switchMode('confirmation');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        // Auth state change listener in AuthContext handles navigation
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950 relative">
      {/* Logo - Top Left Corner */}
      <div className="absolute top-6 left-6 z-20">
        <a href="/landing" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/logo-black.svg" alt="FounderLab" className="h-10 dark:hidden" />
          <img src="/logo-white.svg" alt="FounderLab" className="h-10 hidden dark:block" />
        </a>
      </div>

      {/* ── Left Panel: Form ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen px-6 sm:px-10 lg:px-14 xl:px-16">
        {/* Form Area — centered vertically */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[340px]">
            {/* ── Confirmation State ────────────────────────────── */}
            {mode === 'confirmation' && (
              <div key="confirmation">
                <ConfirmationView
                  email={email}
                  onBackToSignIn={() => switchMode('signin')}
                />
              </div>
            )}

            {/* ── Sign In / Sign Up Forms ───────────────────────── */}
            {mode !== 'confirmation' && (
              <div key={formKey}>
                <Reveal index={0}>
                  <h1 className="text-[26px] font-bold tracking-tight text-stone-950 dark:text-stone-50 mb-1.5 leading-tight">
                    {mode === 'signin' ? 'Welcome back' : 'Create account'}
                  </h1>
                </Reveal>

                <Reveal index={1}>
                  <p className="text-[13px] text-stone-500 dark:text-stone-400 mb-6">
                    {mode === 'signin'
                      ? 'Sign in to continue building your PRDs.'
                      : 'Start turning ideas into investor-ready PRDs.'}
                  </p>
                </Reveal>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Error message */}
                  {error && (
                    <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-[13px] text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Name (signup only) */}
                  {mode === 'signup' && (
                    <Reveal index={2}>
                      <div>
                        <label className="block text-[12px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-[13px] text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500
                                       focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                    </Reveal>
                  )}

                  {/* Email */}
                  <Reveal index={mode === 'signup' ? 3 : 2}>
                    <div>
                      <label className="block text-[12px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-[13px] text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500
                                     focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </Reveal>

                  {/* Password */}
                  <Reveal index={mode === 'signup' ? 4 : 3}>
                    <div>
                      <label className="block text-[12px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg text-[13px] text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500
                                     focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-200"
                        >
                          {showPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </Reveal>

                  {/* Terms acceptance + Reset password */}
                  <Reveal index={mode === 'signup' ? 5 : 4}>
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-stone-800 dark:bg-stone-300 flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-white dark:text-stone-900" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 6l3 3 5-6" />
                          </svg>
                        </div>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400">
                          I agree to the{' '}
                          <a href="/terms" className="text-stone-700 dark:text-stone-300 hover:underline">Terms</a>
                          {' & '}
                          <a href="/privacy" className="text-stone-700 dark:text-stone-300 hover:underline">Privacy</a>
                        </span>
                      </div>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          className="text-[11px] font-medium text-rose-600 hover:text-rose-700 transition-colors duration-200"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                  </Reveal>

                  {/* Submit Button */}
                  <Reveal index={mode === 'signup' ? 6 : 5}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group w-full mt-2 py-2.5 bg-stone-800 dark:bg-stone-700 text-white rounded-lg text-[13px] font-semibold
                                 hover:bg-stone-900 dark:hover:bg-stone-600 active:scale-[0.98] transition-all duration-200
                                 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
                                 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {mode === 'signin' ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </Reveal>
                </form>

                {/* Mode Toggle */}
                <Reveal index={mode === 'signup' ? 7 : 6}>
                  <p className="text-center mt-5 text-[11px] text-stone-500 dark:text-stone-400">
                    {mode === 'signin' ? (
                      <>
                        New here?{' '}
                        <button
                          onClick={() => switchMode('signup')}
                          className="font-semibold text-rose-600 hover:text-rose-700 transition-colors duration-200"
                        >
                          Create Account
                        </button>
                      </>
                    ) : (
                      <>
                        Have an account?{' '}
                        <button
                          onClick={() => switchMode('signin')}
                          className="font-semibold text-rose-600 hover:text-rose-700 transition-colors duration-200"
                        >
                          Sign In
                        </button>
                      </>
                    )}
                  </p>
                </Reveal>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right Panel: Visual ───────────────────────────────────── */}
      <div className="hidden lg:block w-[55%] p-3">
        <VisualPanel />
      </div>
    </div>
  );
}

export default AuthPage;
