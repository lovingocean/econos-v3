import React from 'react';
import { Sparkles, ShieldAlert, ArrowRight, X, Check } from 'lucide-react';
import { PlanId } from '../../types/econos';

interface UpgradePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing: () => void;
  title?: string;
  description?: string;
  requiredPlan?: PlanId;
  featureName?: string;
}

export const UpgradePromptModal: React.FC<UpgradePromptModalProps> = ({
  isOpen,
  onClose,
  onOpenPricing,
  title = 'Plan Upgrade Required',
  description,
  requiredPlan = 'pro',
  featureName = 'This feature'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-100">{title}</h3>
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                Unlocks with {requiredPlan.toUpperCase()} Tier
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1 rounded hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          {description || `${featureName} requires an active ${requiredPlan.toUpperCase()} subscription or 14-day free trial to unlock sovereign execution.`}
        </p>

        <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-2 text-xs text-zinc-300 font-mono">
          <div className="text-zinc-400 font-bold uppercase text-[10px]">What you get:</div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>14-day risk-free trial available</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Elevated resource limits and autonomous agents</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero lock-in • Cancel anytime</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium transition"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenPricing();
            }}
            className="px-4 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs font-mono transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <span>View Pricing & Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
