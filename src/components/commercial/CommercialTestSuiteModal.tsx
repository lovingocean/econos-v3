import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ShieldCheck, 
  Filter, 
  X,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../../api/client';

interface TestItem {
  id: number;
  name: string;
  category: string;
  passed: boolean;
  details: string;
  durationMs: number;
}

interface CommercialTestSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommercialTestSuiteModal: React.FC<CommercialTestSuiteModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    totalTests: number;
    passedCount: number;
    failedCount: number;
    allPassed: boolean;
    totalDurationMs: number;
    tests: TestItem[];
  } | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedTestId, setExpandedTestId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleRunSuite = async () => {
    setIsRunning(true);
    setResults(null);
    try {
      const data = await api.runCommercialTestSuite();
      setResults(data);
    } catch (err: any) {
      console.error('Failed to run commercial test suite', err);
    } finally {
      setIsRunning(false);
    }
  };

  const categories = ['ALL', 'Subscription', 'Entitlement', 'Security', 'Billing', 'Admin'];

  const filteredTests = results?.tests.filter(t => 
    selectedCategory === 'ALL' || t.category.toLowerCase() === selectedCategory.toLowerCase()
  ) || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-4xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="border-b border-slate-100 p-6 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                20-POINT AUDIT SUITE
              </span>
              <span className="text-slate-400 text-xs font-mono">• Sovereign Commercial Verification</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
              Commercial & Entitlement Verification Suite
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authoritative mathematical tests validating signups, trials, upgrades, webhook HMAC, idempotency, and downgrade safety.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar */}
        <div className="bg-slate-50/70 border-b border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunSuite}
              disabled={isRunning}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs font-mono transition flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Executing 20 Point Verification...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{results ? 'Re-run 20-Point Verification' : 'Execute All 20 Commercial Tests'}</span>
                </>
              )}
            </button>

            {results && (
              <span className="text-xs font-mono text-slate-600 flex items-center gap-1.5 ml-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Finished in {results.totalDurationMs}ms</span>
              </span>
            )}
          </div>

          {/* Category Filter */}
          {results && (
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scorecard Summary (When Finished) */}
        {results && (
          <div className={`px-6 py-3 border-b flex items-center justify-between text-xs font-mono ${
            results.allPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">
                {results.allPassed ? 'ALL 20 COMMERCIAL CONSTRAINTS PASSED' : `${results.failedCount} TESTS FAILED`}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>Passed: <strong className="text-emerald-700">{results.passedCount}</strong>/20</span>
              <span>Failed: <strong className={results.failedCount > 0 ? 'text-rose-700' : 'text-slate-400'}>{results.failedCount}</strong></span>
            </div>
          </div>
        )}

        {/* Test Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
          {!results && !isRunning && (
            <div className="p-16 text-center text-slate-500 space-y-3">
              <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="font-mono text-sm text-slate-800 font-bold">SOVEREIGN AUDIT SUITE READY</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Press the button above to execute automated validation across all 20 pricing, subscription, webhook HMAC, multi-tenant isolation, and entitlement verification paths.
              </p>
            </div>
          )}

          {isRunning && (
            <div className="p-16 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <RotateCcw className="w-8 h-8 animate-spin text-slate-900" />
              <div className="font-mono text-xs text-slate-800 font-bold">
                Executing 20 Automated Commercial Proofs...
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Checking signatures, plan boundaries, quota enforcement, and tamper-resistance
              </div>
            </div>
          )}

          {results && filteredTests.map(test => {
            const isExpanded = expandedTestId === test.id;
            return (
              <div
                key={test.id}
                className={`rounded-lg border transition ${
                  test.passed 
                    ? 'border-slate-200 bg-white hover:border-slate-300' 
                    : 'border-rose-200 bg-rose-50/30'
                }`}
              >
                <div 
                  onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {test.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400">#{String(test.id).padStart(2, '0')}</span>
                        <span className="text-xs font-semibold text-slate-800">{test.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
                          {test.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-400">{test.durationMs}ms</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-3 pt-1 text-[11px] font-mono text-slate-600 border-t border-slate-100 bg-slate-50">
                    <div className="text-slate-800">{test.details}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
