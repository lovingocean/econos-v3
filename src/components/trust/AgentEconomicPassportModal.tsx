import React from 'react';
import { EconomicPassport, Agent } from '../../types/econos';
import { 
  ShieldCheck, 
  Key, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  Hash,
  Award
} from 'lucide-react';

interface AgentEconomicPassportModalProps {
  passport: EconomicPassport | null;
  agent: Agent | null;
  onClose: () => void;
}

export const AgentEconomicPassportModal: React.FC<AgentEconomicPassportModalProps> = ({
  passport,
  agent,
  onClose
}) => {
  if (!passport || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto">
        
        {/* Passport Header styled like a sovereign diplomatic document */}
        <div className="border-b-2 border-amber-400/80 pb-4 mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-700 font-bold uppercase tracking-widest text-xs">ECONOS SOVEREIGN TRUST REPOSITORY</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">W3C Verifiable Credential</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 font-sans mt-0.5">Autonomous Agent Economic Passport</h2>
              <div className="text-[10px] text-slate-400">Document ID: {passport.passportId}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Identity Grid */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Bearer Identity</span>
              <span className="text-slate-900 font-bold font-sans text-sm">{passport.agentName || agent.name}</span>
              <span className="text-[10px] text-slate-400 block">{passport.agentId || agent.id}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Issuing Authority</span>
              <span className="text-slate-800 font-bold">{passport.issuer}</span>
              <span className="text-[10px] text-slate-500 block">Organization: {passport.organizationName}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Verified Trust Score</span>
              <span className="text-amber-700 font-bold text-base">
                {passport.currentTrustScore !== null && passport.currentTrustScore !== undefined 
                  ? `${passport.currentTrustScore}/100` 
                  : 'INSUFFICIENT DATA'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Reputation Rating</span>
              <span className="text-emerald-700 font-bold">{passport.reputationRating}</span>
              <span className="text-[10px] text-slate-400 block">Issued: {new Date(passport.issuedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Economic Mandate & Spending Limits */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 mb-4">
          <div className="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authorized Economic Mandate & Limits</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 block">Single Transaction Cap:</span>
              <span className="text-emerald-700 font-bold">${passport.economicAuthorityLimitUsd.toLocaleString()}</span>
            </div>

            <div>
              <span className="text-slate-500 block">Risk Tier Classification:</span>
              <span className="text-slate-800 font-bold">{passport.riskClassification}</span>
            </div>

            <div>
              <span className="text-slate-500 block">Verified Outcomes Executed:</span>
              <span className="text-slate-800 font-bold">{passport.verifiedOutcomesCount} validated</span>
            </div>

            <div>
              <span className="text-slate-500 block">Active Security Incidents:</span>
              <span className={`font-bold ${passport.activeIncidentsCount === 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {passport.activeIncidentsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Cryptographic Signature Verification */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>Ed25519 Cryptographic Verification</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>SIGNATURE VALID</span>
            </span>
          </div>

          <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[10px] text-slate-600 break-all font-mono">
            {passport.cryptographicSignature}
          </div>
        </div>

        {/* Permitted Tools */}
        <div className="space-y-2 mb-4">
          <span className="text-[10px] text-slate-600 uppercase font-bold">Permitted Autonomous Tools ({passport.permittedTools?.length || 0})</span>
          <div className="flex flex-wrap gap-1.5">
            {passport.permittedTools?.map((tool, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] border border-slate-200">
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Jurisdiction */}
        {passport.jurisdictionRestrictions && passport.jurisdictionRestrictions.length > 0 && (
          <div className="space-y-2 mb-4">
            <span className="text-[10px] text-slate-600 uppercase font-bold">Permitted Operating Jurisdictions</span>
            <div className="flex flex-wrap gap-1.5">
              {passport.jurisdictionRestrictions.map((j, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] border border-slate-200">
                  {j}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition font-mono font-medium"
          >
            Close Passport
          </button>
        </div>

      </div>
    </div>
  );
};
