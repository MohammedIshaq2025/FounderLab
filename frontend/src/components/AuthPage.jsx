import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Quote,
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
        className="group text-sm font-semibold text-terra-500 hover:text-terra-600 transition-all duration-200 flex items-center gap-1.5"
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

/* ─── Decorative Right Panel ────────────────────────────────────── */

function VisualPanel() {
  return (
    <div className="hidden lg:flex relative w-full h-full overflow-hidden rounded-2xl">
      {/* Layered gradient mesh — warm terracotta + stone + deep blue */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 20%, #E8613C 0%, transparent 50%),
            radial-gradient(ellipse 60% 80% at 30% 80%, #C4502D 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 90% 60%, #7C6B8A 0%, transparent 40%),
            radial-gradient(ellipse 50% 70% at 10% 30%, #44403C 0%, transparent 50%),
            linear-gradient(145deg, #292524 0%, #1C1917 40%, #231F1E 100%)
          `,
        }}
      />

      {/* Animated overlay blob */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(circle 400px at 60% 40%, rgba(232,97,60,0.4) 0%, transparent 60%),
            radial-gradient(circle 300px at 30% 70%, rgba(168,162,158,0.2) 0%, transparent 50%)
          `,
          animation: 'authGradientDrift 12s ease-in-out infinite alternate',
        }}
      />

      {/* Subtle noise / grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col justify-between w-full h-full p-10">
        {/* Top tagline */}
        <div>
          <p className="text-white/60 text-[13px] font-medium tracking-wide uppercase">
            Idea to PRD in minutes
          </p>
        </div>

        {/* Bottom testimonial card */}
        <div
          className="max-w-sm"
          style={{ animation: 'authFloat 6s ease-in-out infinite' }}
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <Quote className="w-5 h-5 text-terra-400 mb-3 opacity-80" />
            <p className="text-white/90 text-[14px] leading-relaxed mb-5">
              Founder Lab turned my rough startup idea into a structured,
              investor-ready PRD. The AI coaching felt like working with
              a seasoned product strategist.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-terra-400 to-terra-600 flex items-center justify-center text-white text-xs font-bold">
                SC
              </div>
              <div>
                <p className="text-white/90 text-[13px] font-semibold">Sarah Chen</p>
                <p className="text-white/50 text-[12px]">@sarahdigital</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes authGradientDrift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-30px, 20px) scale(1.05); }
        }
        @keyframes authFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

/* ─── Auth Form Component ───────────────────────────────────────── */

function AuthPage() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'confirmation'
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
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
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950">
      {/* ── Left Panel: Form ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen px-6 sm:px-12 lg:px-16 xl:px-20">
        {/* Logo */}
        <div className="pt-8 pb-4">
          <Reveal index={0}>
            <div className="flex items-center">
              <img src="/logo-black.svg" alt="FounderLab" className="h-12 dark:hidden" />
              <img src="/logo-white.svg" alt="FounderLab" className="h-12 hidden dark:block" />
            </div>
          </Reveal>
        </div>

        {/* Form Area — centered vertically */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[400px]">
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
                  <h1 className="text-[30px] font-bold tracking-tight text-stone-950 dark:text-stone-50 mb-2 leading-tight">
                    {mode === 'signin' ? 'Welcome back' : 'Create your account'}
                  </h1>
                </Reveal>

                <Reveal index={1}>
                  <p className="text-[15px] text-stone-500 dark:text-stone-400 mb-8">
                    {mode === 'signin'
                      ? 'Sign in to continue building your PRDs.'
                      : 'Start turning ideas into investor-ready PRDs.'}
                  </p>
                </Reveal>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <label className="block text-[13px] font-medium text-stone-600 dark:text-stone-400 mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-[14px] text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500
                                       focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                    </Reveal>
                  )}

                  {/* Email */}
                  <Reveal index={mode === 'signup' ? 3 : 2}>
                    <div>
                      <label className="block text-[13px] font-medium text-stone-600 dark:text-stone-400 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-[14px] text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500
                                     focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </Reveal>

                  {/* Password */}
                  <Reveal index={mode === 'signup' ? 4 : 3}>
                    <div>
                      <label className="block text-[13px] font-medium text-stone-600 dark:text-stone-400 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="w-full pl-10 pr-11 py-3 bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-[14px] text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500
                                     focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-200"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </Reveal>

                  {/* Keep signed in + Reset (signin only) */}
                  {mode === 'signin' && (
                    <Reveal index={4}>
                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                          <div
                            onClick={() => setKeepSignedIn(!keepSignedIn)}
                            className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                              keepSignedIn
                                ? 'border-stone-800 dark:border-stone-300 bg-stone-800 dark:bg-stone-300'
                                : 'border-stone-300 dark:border-stone-600 group-hover:border-stone-400 dark:group-hover:border-stone-500'
                            }`}
                          >
                            {keepSignedIn && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-stone-900" />
                            )}
                          </div>
                          <span className="text-[13px] text-stone-600 dark:text-stone-400">
                            Keep me signed in
                          </span>
                        </label>
                        <button
                          type="button"
                          className="text-[13px] font-medium text-terra-500 hover:text-terra-600 transition-colors duration-200"
                        >
                          Reset password
                        </button>
                      </div>
                    </Reveal>
                  )}

                  {/* Submit Button */}
                  <Reveal index={mode === 'signup' ? 5 : 5}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group w-full mt-3 py-3 bg-stone-800 dark:bg-stone-700 text-white rounded-xl text-sm font-semibold
                                 hover:bg-stone-900 dark:hover:bg-stone-600 active:scale-[0.98] transition-all duration-200
                                 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
                                 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {mode === 'signin' ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </Reveal>

                  {/* Divider */}
                  <Reveal index={6}>
                    <div className="flex items-center gap-3 py-2">
                      <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
                      <span className="text-[12px] text-stone-400 dark:text-stone-500 font-medium">
                        Or continue with
                      </span>
                      <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
                    </div>
                  </Reveal>

                  {/* Google Button */}
                  <Reveal index={7}>
                    <button
                      type="button"
                      className="w-full py-3 bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-300
                                 hover:bg-stone-50 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-600 active:scale-[0.98] transition-all duration-200
                                 flex items-center justify-center gap-2.5"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>
                  </Reveal>
                </form>

                {/* Mode Toggle */}
                <Reveal index={8}>
                  <p className="text-center mt-8 text-[13px] text-stone-500 dark:text-stone-400">
                    {mode === 'signin' ? (
                      <>
                        New to Founder Lab?{' '}
                        <button
                          onClick={() => switchMode('signup')}
                          className="font-semibold text-terra-500 hover:text-terra-600 transition-colors duration-200"
                        >
                          Create Account
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          onClick={() => switchMode('signin')}
                          className="font-semibold text-terra-500 hover:text-terra-600 transition-colors duration-200"
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
