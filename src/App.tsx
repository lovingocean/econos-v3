import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { LayerNavigation } from './components/layout/LayerNavigation';
import { BusinessWorkspace } from './components/business/BusinessWorkspace';
import { WealthWorkspace } from './components/wealth/WealthWorkspace';
import { TrustWorkspace } from './components/trust/TrustWorkspace';
import { EconomicGraphView } from './components/graph/EconomicGraphView';
import { SystemTestSuiteModal } from './components/testing/SystemTestSuite';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { PricingModal } from './components/commercial/PricingModal';
import { CommercialAnalyticsView } from './components/commercial/CommercialAnalyticsView';
import { AdminPricingConfigModal } from './components/commercial/AdminPricingConfigModal';
import { CommercialTestSuiteModal } from './components/commercial/CommercialTestSuiteModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { AppLayer } from './types/econos';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Network, 
  FlaskConical,
  ExternalLink,
  DollarSign
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [currentLayer, setCurrentLayer] = useState<AppLayer>('BUSINESS');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAdminConfigOpen, setIsAdminConfigOpen] = useState(false);
  const [isCommercialSuiteOpen, setIsCommercialSuiteOpen] = useState(false);

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-[#f8f9f6] flex flex-col items-center justify-center font-mono text-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-[#132338] flex items-center justify-center text-white font-black text-xl shadow-md animate-pulse mb-3">
          E
        </div>
        <p className="text-xs font-bold tracking-widest text-slate-600 uppercase">ECONOS SOVEREIGN OS</p>
        <p className="text-[10px] text-slate-400 mt-1">Resolving secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9f6] text-slate-900 bg-architect-grid flex flex-col selection:bg-amber-500/20 selection:text-amber-900">
      {/* Top Fixed Navbar */}
      <Navbar
        onOpenTestSuite={() => setIsTestModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenCommercialAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenAdminPricing={() => setIsAdminConfigOpen(true)}
        onOpenCommercialSuite={() => setIsCommercialSuiteOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Layer Selector Bar */}
        <LayerNavigation
          currentLayer={currentLayer}
          onSelectLayer={setCurrentLayer}
        />

        {/* Dynamic Layer Content */}
        <div className="transition-all duration-200">
          {currentLayer === 'BUSINESS' && (
            <BusinessWorkspace />
          )}

          {currentLayer === 'WEALTH' && (
            <WealthWorkspace />
          )}

          {currentLayer === 'TRUST' && (
            <TrustWorkspace />
          )}

          {currentLayer === 'GRAPH' && (
            <EconomicGraphView />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-sm py-6 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-800">ECONOS Sovereign Operating Core</span>
            <span>• Multi-Tenant Isolation Verified</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="hover:text-amber-600 flex items-center gap-1 transition text-slate-700 font-medium"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-500" />
              <span>Pricing & Plans</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setIsCommercialSuiteOpen(true)}
              className="hover:text-emerald-700 flex items-center gap-1 transition text-emerald-600 font-medium"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>20-Point Commercial Suite</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">Gemini 3.8 Flash • Sovereign License</span>
          </div>
        </div>
      </footer>

      {/* System Test Suite Modal */}
      <SystemTestSuiteModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />

      {/* Onboarding / Tenant Setup Modal */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
      />

      {/* Pricing & Commercial Model Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onOpenAdminConfig={() => setIsAdminConfigOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
      />

      {/* Commercial Analytics View */}
      <CommercialAnalyticsView
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* Admin Pricing Configuration Modal */}
      <AdminPricingConfigModal
        isOpen={isAdminConfigOpen}
        onClose={() => setIsAdminConfigOpen(false)}
      />

      {/* 20-Point Commercial Verification Suite */}
      <CommercialTestSuiteModal
        isOpen={isCommercialSuiteOpen}
        onClose={() => setIsCommercialSuiteOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
