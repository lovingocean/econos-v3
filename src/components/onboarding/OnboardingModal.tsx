import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { Building2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Organization } from '../../types/econos';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { user, createOrganization, refreshContext } = useAuth();
  const [orgName, setOrgName] = useState('');
  const [bizName, setBizName] = useState('');
  const [tier, setTier] = useState<Organization['tier']>('PRO');
  const [industry, setIndustry] = useState('Enterprise Technology & SaaS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    setIsSubmitting(true);
    setErrorNotice(null);
    try {
      const org = await createOrganization(orgName.trim(), tier);
      if (bizName.trim()) {
        try {
          await api.createBusiness(bizName.trim(), industry);
        } catch (_) {}
      }
      await refreshContext();
      setOrgName('');
      setBizName('');
      onClose();
    } catch (err: any) {
      setErrorNotice(err.message || 'Failed to provision organization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl font-mono text-xs">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">Create Sovereign Tenant</h2>
              <p className="text-[11px] text-slate-500 font-sans">Multi-tenant isolated sovereign container.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorNotice && (
          <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorNotice}</span>
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-slate-600 mb-1 font-medium">Organization / Holding Name</label>
            <input
              type="text"
              required
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              placeholder="e.g. Acme Sovereign Holdings"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium">Initial Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {(['PRO', 'ENTERPRISE', 'COMMUNITY'] as Organization['tier'][]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`py-1.5 px-2 rounded-lg text-center font-bold border transition ${
                    tier === t 
                      ? 'bg-[#132338] text-white border-[#132338]' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium">Primary Operating Business Name</label>
            <input
              type="text"
              required
              value={bizName}
              onChange={e => setBizName(e.target.value)}
              placeholder="e.g. Acme Cloud Systems Inc."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium">Industry Sector</label>
            <input
              type="text"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-500">
            A segregated economic database, wealth ledger, and autonomous agent firewall namespace will be provisioned.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-[#132338] hover:bg-[#0d1928] text-white font-bold transition cursor-pointer"
            >
              {isSubmitting ? 'Provisioning...' : 'Provision Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
