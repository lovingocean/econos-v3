import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  Sparkles, 
  Crown, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Organization } from '../../types/econos';

interface AuthScreenProps {
  initialTab?: 'login' | 'signup';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ initialTab = 'login' }) => {
  const { login, signup, loginAsMeek, loginAsDemo, isLoading } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [tier, setTier] = useState<Organization['tier']>('PRO');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginEmail.trim()) {
      setError('Please enter your account email.');
      return;
    }
    setSubmitting(true);
    try {
      await login(loginEmail.trim(), loginPassword);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError('Full name and work email are required.');
      return;
    }
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        organizationName: organizationName.trim() || `${name.trim()}'s Holdings`,
        businessName: businessName.trim() || `${organizationName.trim() || name.trim()} Operations`,
        tier
      });
    } catch (err: any) {
      setError(err.message || 'Failed to register account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMeekOneClick = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await loginAsMeek();
    } catch (err: any) {
      setError(err.message || 'Could not initialize sovereign owner session.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoOneClick = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await loginAsDemo();
    } catch (err: any) {
      setError(err.message || 'Could not launch demo sandbox.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9f6] text-slate-900 bg-architect-grid flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/20 selection:text-amber-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Icon & Heading */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-[#132338] flex items-center justify-center text-white font-black shadow-md tracking-tight text-xl">
            E
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">ECONOS</h1>
            <p className="text-[10px] tracking-widest text-slate-500 font-mono uppercase font-bold">Sovereign Operating Core</p>
          </div>
        </div>

        <h2 className="text-center text-xl font-bold tracking-tight text-slate-800">
          {tab === 'login' ? 'Authenticate Sovereign Session' : 'Provision Sovereign Organization'}
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 font-mono">
          Multi-tenant isolation • Server-verified cryptographic access
        </p>

        {/* Tab Switcher */}
        <div className="mt-6 p-1 bg-slate-200/80 rounded-xl flex items-center gap-1 shadow-inner max-w-xs mx-auto text-xs font-mono">
          <button
            id="auth-tab-login"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-signup"
            onClick={() => {
              setTab('signup');
              setError(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all ${
              tab === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200/90 space-y-6">
          
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{error}</div>
            </div>
          )}

          {/* TAB: LOGIN */}
          {tab === 'login' && (
            <div className="space-y-6">
              {/* Sovereign Verified Fast-Track Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/90 to-amber-100/40 border border-amber-300/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">Sovereign Owner Access</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 font-bold border border-amber-300">
                    OWNER Role
                  </span>
                </div>
                <p className="text-xs text-amber-900/80 mb-3">
                  Direct production server-side verification for Meek Ifti with full admin and commercial governance privileges.
                </p>
                <button
                  id="login-meek-direct-btn"
                  onClick={handleMeekOneClick}
                  disabled={submitting || isLoading}
                  className="w-full py-2 px-4 rounded-xl bg-[#132338] hover:bg-[#1b2f48] text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sign In as Meek Ifti (meekifti@gmail.com)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </button>
              </div>

              {/* Standard Email/Password Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="login-email-input"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="login-password-input"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter master password"
                      className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={submitting || isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Verifying...' : 'Sign In to Sovereign Session'}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </form>

              {/* Demo Sandbox Isolation Launcher */}
              <div className="pt-4 border-t border-slate-100">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      <span>Demo Sandbox (Alex Sterling)</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Isolated tenant • Apex Dynamics Holdings
                    </div>
                  </div>
                  <button
                    id="login-demo-sandbox-btn"
                    onClick={handleDemoOneClick}
                    disabled={submitting || isLoading}
                    className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition shrink-0 shadow-2xs"
                  >
                    Explore Demo Tenant
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SIGNUP */}
          {tab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="signup-name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Meek Ifti"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="signup-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="meekifti@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="signup-password-input"
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure master password (min 6 chars)"
                    className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization / Holding Co.
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="signup-org-input"
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="e.g. Econos Holdings"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Operating Business Entity
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="signup-business-input"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Core Systems"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Tier Selection */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Initial Plan & Entitlements
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setTier('PRO')}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      tier === 'PRO'
                        ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">PRO Founder</span>
                      <span className="text-[10px] font-mono font-bold text-amber-700">$39/mo</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Full Wealth Engines, Sovereign AI Advisor, autonomous firewall & 5 agents.
                    </p>
                  </div>

                  <div
                    onClick={() => setTier('ENTERPRISE')}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      tier === 'ENTERPRISE'
                        ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">ENTERPRISE</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700">Custom</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Infinite agents, dedicated infrastructure, SAML SSO, and custom governance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You will be automatically granted the <strong>OWNER</strong> role for this organization.</span>
              </div>

              <button
                id="signup-submit-btn"
                type="submit"
                disabled={submitting || isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#132338] hover:bg-[#1b2f48] text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
              >
                {submitting ? 'Provisioning Sovereign Environment...' : 'Initialize Organization as OWNER'}
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
