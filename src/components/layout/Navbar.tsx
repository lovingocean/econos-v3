import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  ChevronDown, 
  RotateCcw, 
  Plus, 
  FlaskConical, 
  Bell,
  Sparkles,
  DollarSign,
  Activity,
  Sliders,
  Search,
  Check,
  LogOut
} from 'lucide-react';
import { UserRole } from '../../types/econos';

interface NavbarProps {
  onOpenTestSuite: () => void;
  onOpenPricing: () => void;
  onOpenCommercialAnalytics: () => void;
  onOpenAdminPricing: () => void;
  onOpenCommercialSuite: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenTestSuite,
  onOpenPricing,
  onOpenCommercialAnalytics,
  onOpenAdminPricing,
  onOpenCommercialSuite
}) => {
  const { 
    currentOrg, 
    organizations, 
    currentBusiness, 
    businesses,
    user, 
    isDemo, 
    subscription,
    activePlan,
    switchOrganization, 
    switchRole,
    switchUser,
    setOpenOnboarding,
    resetDemoEnvironment,
    logout
  } = useAuth();

  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showCommercialMenu, setShowCommercialMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDemo = async () => {
    if (confirm('Reset demo environment to original seed baseline?')) {
      setIsResetting(true);
      try {
        await resetDemoEnvironment();
      } finally {
        setIsResetting(false);
      }
    }
  };

  const roles: UserRole[] = ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'];
  const isUserAdmin = user?.role === 'OWNER' || user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Identity & Tenant Context */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#132338] flex items-center justify-center text-white font-black shadow-sm tracking-tight text-sm">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base uppercase text-slate-900">ECONOS</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">v1.0</span>
              </div>
              <div className="text-[10px] tracking-widest text-slate-500 font-mono uppercase">Trust & Economic OS</div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          {/* Org Switcher with Clear DEMO vs REAL Isolation Tag */}
          <div className="relative">
            <button
              id="org-switcher-button"
              onClick={() => setShowOrgMenu(!showOrgMenu)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-xs shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800 truncate max-w-[160px]">{currentOrg?.name || 'Loading Org...'}</span>
                  {isDemo ? (
                    <span className="px-1.5 py-0.2 text-[9px] rounded font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      DEMO TENANT
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 text-[9px] rounded font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      REAL TENANT
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">{currentBusiness?.name || 'Primary Business'}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showOrgMenu && (
              <div className="absolute left-0 mt-1 w-72 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-500 border-b border-slate-100 flex justify-between items-center">
                  <span>Switch Organization</span>
                  <span className="text-slate-400">Tenant Isolation</span>
                </div>
                <div className="py-1 max-h-60 overflow-y-auto">
                  {organizations.map(org => (
                    <button
                      key={org.id}
                      onClick={() => {
                        switchOrganization(org.id);
                        setShowOrgMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 transition ${
                        org.id === currentOrg?.id ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-medium truncate">{org.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{org.tier} Tier</div>
                      </div>
                      {org.isDemo ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          DEMO
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          REAL
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-100 p-1.5">
                  <button
                    onClick={() => {
                      setShowOrgMenu(false);
                      setOpenOnboarding(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs bg-[#132338] hover:bg-[#0c1827] text-white transition font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Organization</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Security, Commercial & Role Testing Controls */}
        <div className="flex items-center gap-2">
          
          {/* Active Plan & Pricing Button */}
          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-mono transition shadow-xs"
            title="Manage subscription and view pricing tiers"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold uppercase text-slate-800">
              {activePlan?.name || subscription?.planId || 'FREE'}
            </span>
            {subscription?.status === 'TRIALING' && (
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                TRIAL
              </span>
            )}
          </button>

          {/* Commercial & Telemetry Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCommercialMenu(!showCommercialMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 transition shadow-xs"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline font-medium">Commercial</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showCommercialMenu && (
              <div className="absolute right-0 mt-1 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50 text-xs font-mono">
                <div className="px-3 py-1.5 text-[10px] text-slate-400 uppercase border-b border-slate-100 font-bold">
                  Commercial & Pricing OS
                </div>
                <button
                  onClick={() => {
                    onOpenPricing();
                    setShowCommercialMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 transition flex items-center gap-2 text-slate-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pricing & Tiers</span>
                </button>

                <button
                  onClick={() => {
                    onOpenCommercialAnalytics();
                    setShowCommercialMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 transition flex items-center gap-2 text-slate-700"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Commercial Telemetry</span>
                </button>

                <button
                  onClick={() => {
                    onOpenCommercialSuite();
                    setShowCommercialMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 transition flex items-center gap-2 text-emerald-700 font-medium"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                  <span>20-Point Audit Suite</span>
                </button>

                {(user?.role === 'OWNER' || user?.role === 'ADMIN') && (
                  <button
                    onClick={() => {
                      onOpenAdminPricing();
                      setShowCommercialMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 transition flex items-center gap-2 text-slate-700 border-t border-slate-100"
                  >
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Admin Pricing Config</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Demo Reset button if in Demo tenant */}
          {isDemo && (
            <button
              onClick={handleResetDemo}
              disabled={isResetting}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs transition shadow-xs"
              title="Reset demo data to baseline seed"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="text-[11px] font-mono">Reset Demo</span>
            </button>
          )}

          {/* Test Suite Button */}
          <button
            id="test-suite-btn"
            onClick={onOpenTestSuite}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400 text-slate-800 text-xs font-mono transition shadow-xs"
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-medium">System Tests</span>
          </button>

          {/* Admin Config Direct Button */}
          {isUserAdmin && (
            <button
              onClick={onOpenAdminPricing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-semibold transition shadow-xs"
              title="Open Admin Pricing & Entitlements Configuration"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Admin Config</span>
            </button>
          )}

          {/* Role Switcher (RBAC simulation) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold">{user?.role || 'OWNER'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50 text-xs font-mono">
                <div className="px-3 py-1.5 text-[10px] text-slate-400 uppercase border-b border-slate-100 font-bold">
                  Simulate RBAC Role
                </div>
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition flex items-center justify-between ${
                      user?.role === r ? 'text-[#132338] font-bold bg-slate-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{r}</span>
                    {user?.role === r && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Round Pill Action Buttons (Search, Notification, Profile dropdown) */}
          <div className="flex items-center gap-1.5 pl-1">
            <button 
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition shadow-xs"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button 
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition relative shadow-xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
            </button>

            {/* Interactive User Profile & Identity Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                title="Account & Identity Settings"
              >
                <div className="w-9 h-9 rounded-full bg-[#132338] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {user?.name?.charAt(0) || 'M'}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-none">{user?.name || 'Meek Ifti'}</div>
                  <div className="text-[10px] font-mono text-slate-400 leading-none mt-0.5">{user?.email || 'meekifti@gmail.com'}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 text-xs">
                  {/* User Profile Card */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">{user?.name || 'Meek Ifti'}</div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {user?.role || 'OWNER'}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">{user?.email || 'meekifti@gmail.com'}</div>
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Active Plan:</span>
                      <span className="font-bold text-[#132338] uppercase">{activePlan?.name || subscription?.planId || 'PRO'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] mt-1">
                      <span className="text-slate-500">Tenant Org:</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[140px]">{currentOrg?.name}</span>
                    </div>
                  </div>

                  {/* Primary Actions */}
                  <div className="space-y-1 mb-3">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAdminPricing();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-amber-50/80 hover:bg-amber-100/80 text-amber-900 border border-amber-200 flex items-center gap-2 font-semibold transition"
                    >
                      <Sliders className="w-4 h-4 text-amber-700" />
                      <span>Admin Pricing & Entitlements</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenPricing();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 flex items-center gap-2 font-medium transition"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Change Plan / View Tiers</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setOpenOnboarding(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 flex items-center gap-2 font-medium transition"
                    >
                      <Plus className="w-4 h-4 text-emerald-600" />
                      <span>Create New Organization</span>
                    </button>
                  </div>

                  {/* Identity Switcher */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="px-1 text-[10px] font-mono uppercase text-slate-400 font-bold mb-1.5">
                      Switch Identity
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          switchUser('usr_real_meeki');
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] transition ${
                          user?.id === 'usr_real_meeki' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div>
                          <div>Meek Ifti (Owner / Admin)</div>
                          <div className="text-[9px] text-slate-400 font-mono">meekifti@gmail.com</div>
                        </div>
                        {user?.id === 'usr_real_meeki' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>

                      <button
                        onClick={() => {
                          switchUser('usr_demo_founder');
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] transition ${
                          user?.id === 'usr_demo_founder' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div>
                          <div>Alex Sterling (Demo Founder)</div>
                          <div className="text-[9px] text-slate-400 font-mono">demo@econo-systems.internal</div>
                        </div>
                        {user?.id === 'usr_demo_founder' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    </div>
                  </div>

                  {/* Sign Out / Lock Session */}
                  <div className="pt-2 border-t border-slate-100 mt-2">
                    <button
                      id="navbar-logout-btn"
                      onClick={async () => {
                        setShowUserMenu(false);
                        await logout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium transition text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>Sign Out / Lock Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
