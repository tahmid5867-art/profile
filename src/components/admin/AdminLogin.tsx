import React, { useState } from 'react';
import {
  useAuth,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
} from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import {
  Shield,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const {
    signInWithEmail,
    signUpAdmin,
    sendPasswordReset,
    signInWithGoogle,
    authError,
    clearAuthError,
    currentUser,
    isAdmin,
    signOut,
  } = useAuth();
  const { navigate } = useRouter();

  const [mode, setMode] = useState<'signin' | 'setup' | 'reset'>('signin');
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEFAULT_ADMIN_PASSWORD);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);
    setResetSuccess(false);

    if (!email.trim()) {
      setLocalError('Please enter a valid administrator email.');
      return;
    }

    if (mode === 'reset') {
      setSubmitting(true);
      try {
        await sendPasswordReset(email);
        setResetSuccess(true);
      } catch (err: unknown) {
        setLocalError(err instanceof Error ? err.message : 'Password reset failed');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    if (mode === 'setup') {
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }

      setSubmitting(true);
      try {
        await signUpAdmin(email, password);
        setSetupSuccess(true);
      } catch (err: unknown) {
        setLocalError(err instanceof Error ? err.message : 'Admin credential setup failed');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Sign in mode
    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    clearAuthError();
    setLocalError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch {
      // Handled in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FC] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute w-[500px] h-[300px] bg-[#6C9BFF]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl bg-[#121A2B] border border-[#29354B] p-8 sm:p-10 shadow-2xl space-y-6 text-center">
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C9BFF] to-[#3B62D1] mx-auto flex items-center justify-center text-white shadow-xl shadow-[#6C9BFF]/20">
          <Shield className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#F5F7FC]">
            {mode === 'setup'
              ? 'Initialize Admin Credentials'
              : mode === 'reset'
              ? 'Reset Administrator Password'
              : 'Administrator Login'}
          </h2>
          <p className="text-xs text-[#A7B2C8] mt-1">
            {mode === 'setup'
              ? 'Set your password for tahmid5867@gmail.com'
              : mode === 'reset'
              ? 'A recovery link will be sent to your email'
              : 'Enter your administrator credentials to access the console'}
          </p>
        </div>

        {/* Status notice if signed in but not authorized */}
        {currentUser && !isAdmin && (
          <div className="p-4 rounded-2xl bg-[#E05252]/10 border border-[#E05252]/40 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E05252]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Unauthorized Account</span>
            </div>
            <p className="text-xs text-[#A7B2C8] leading-relaxed">
              You are signed in as <span className="text-[#F5F7FC] font-semibold">{currentUser.email}</span>, which is not registered as an administrator.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => signOut()}
                className="px-3 py-1.5 rounded-lg bg-[#18243A] text-xs font-medium text-[#E05252] hover:bg-[#E05252]/20 transition-colors"
              >
                Sign Out & Switch Account
              </button>
            </div>
          </div>
        )}

        {/* Error message banner */}
        {(authError || localError) && (
          <div className="p-3.5 rounded-xl bg-[#E05252]/10 border border-[#E05252]/40 text-xs text-[#E05252] text-left flex items-start gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{localError || authError}</span>
          </div>
        )}

        {/* Success message banner for reset */}
        {resetSuccess && (
          <div className="p-3.5 rounded-xl bg-[#52C481]/15 border border-[#52C481]/40 text-xs text-[#52C481] text-left flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Password reset email dispatched! Please check your inbox.</span>
          </div>
        )}

        {/* Mode switcher tabs */}
        <div className="flex rounded-xl bg-[#0B1020] p-1 border border-[#29354B]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              clearAuthError();
              setLocalError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'signin' ? 'bg-[#18243A] text-[#F5F7FC] shadow-sm' : 'text-[#A7B2C8] hover:text-[#F5F7FC]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('setup');
              clearAuthError();
              setLocalError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'setup' ? 'bg-[#18243A] text-[#6C9BFF] shadow-sm' : 'text-[#A7B2C8] hover:text-[#F5F7FC]'
            }`}
          >
            First-Time Setup
          </button>
        </div>

        {/* Default Admin Credentials Helper Card */}
        {mode === 'signin' && (
          <div className="p-4 rounded-2xl bg-[#6C9BFF]/10 border border-[#6C9BFF]/30 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6C9BFF] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Default Admin Login</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail(DEFAULT_ADMIN_EMAIL);
                  setPassword(DEFAULT_ADMIN_PASSWORD);
                }}
                className="text-[10px] text-[#6C9BFF] hover:underline font-semibold"
              >
                Auto-Fill Defaults
              </button>
            </div>
            <div className="text-[11px] text-[#A7B2C8] space-y-0.5 font-mono">
              <div>Email: <span className="text-[#F5F7FC] font-semibold">{DEFAULT_ADMIN_EMAIL}</span></div>
              <div>Password: <span className="text-[#F5F7FC] font-semibold">{DEFAULT_ADMIN_PASSWORD}</span></div>
            </div>
            <p className="text-[10px] text-[#A7B2C8]/80 pt-1 border-t border-[#6C9BFF]/20">
              You can change this password anytime in the Admin Profile tab after logging in.
            </p>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F5F7FC] flex items-center justify-between">
              <span>Admin Email</span>
              {mode === 'setup' && (
                <span className="text-[10px] text-[#6C9BFF] font-mono">Designated Owner</span>
              )}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A7B2C8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tahmid5867@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] placeholder-[#A7B2C8]/50 focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
              />
            </div>
          </div>

          {/* Password input (unless in reset mode) */}
          {mode !== 'reset' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#F5F7FC]">
                  {mode === 'setup' ? 'Create Password' : 'Password'}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('reset');
                      clearAuthError();
                      setLocalError(null);
                    }}
                    className="text-[11px] text-[#6C9BFF] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A7B2C8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] placeholder-[#A7B2C8]/50 focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7B2C8] hover:text-[#F5F7FC] p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password for Setup Mode */}
          {mode === 'setup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F5F7FC]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A7B2C8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#18243A] border border-[#29354B] text-xs sm:text-sm text-[#F5F7FC] placeholder-[#A7B2C8]/50 focus:outline-none focus:ring-2 focus:ring-[#6C9BFF]"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#6C9BFF] to-[#4574E8] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#6C9BFF]/25 hover:shadow-[#6C9BFF]/40 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'setup'
                    ? 'Create & Authorize Password'
                    : mode === 'reset'
                    ? 'Send Password Reset Email'
                    : 'Sign In to Admin Console'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {mode === 'reset' && (
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="w-full text-center text-xs text-[#A7B2C8] hover:text-[#F5F7FC] pt-1"
            >
              Back to Sign In
            </button>
          )}
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#29354B] w-full" />
          <span className="bg-[#121A2B] px-3 text-[11px] uppercase font-mono text-[#A7B2C8]/70">
            Or Authenticate Via
          </span>
        </div>

        {/* Alternative Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-[#18243A] border border-[#29354B] text-[#F5F7FC] text-xs font-semibold hover:border-[#6C9BFF]/60 hover:bg-[#18243A]/80 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign In with Google</span>
        </button>

        {/* Security Info */}
        <div className="pt-3 border-t border-[#29354B] text-left text-[11px] text-[#A7B2C8] space-y-1 leading-relaxed">
          <p>
            • <strong>Authorized Superadmin:</strong> <code className="text-[#F5F7FC] bg-[#0B1020] px-1 py-0.5 rounded">tahmid5867@gmail.com</code>
          </p>
          <p>
            • Passwords are encrypted directly by Firebase Authentication engine.
          </p>
        </div>

        {/* Return to Public Website */}
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#A7B2C8] hover:text-[#F5F7FC] transition-colors"
          >
            &larr; Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
