import React, { useState } from 'react';
import { api } from '../../api/client';
import { 
  FlaskConical, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RotateCcw, 
  X, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

interface SystemTestSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemTestSuiteModal: React.FC<SystemTestSuiteModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const res = await api.runSystemTests();
      setTestResults(res);
    } catch (err: any) {
      alert('Test suite execution failed: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl font-mono text-xs max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-700 font-bold uppercase tracking-wider text-xs">ECONOS VERIFICATION HARNESS</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">Automated</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 font-sans mt-0.5">System-Wide Automated Verification Suite</h2>
              <div className="text-[10px] text-slate-500">
                Executes live end-to-end tests across Multi-Tenancy, AI Firewall, Risk Escrow, Math, and Graph.
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button & Summary */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {testResults ? (
              <div className="flex items-center gap-3">
                <span className={`text-base font-bold flex items-center gap-1.5 ${
                  testResults.allPassed ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {testResults.allPassed ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
                  <span>{testResults.passedCount} / {testResults.totalTests} Tests Passed</span>
                </span>
                <span className="text-[10px] text-slate-500">
                  Completed in {testResults.totalDurationMs}ms
                </span>
              </div>
            ) : (
              <span className="text-slate-600">8 verification tests ready for execution.</span>
            )}
          </div>

          <button
            id="run-all-tests-btn"
            onClick={handleRunTests}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-2 self-start sm:self-auto"
          >
            {isRunning ? (
              <span>Running Suite...</span>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run Automated Tests</span>
              </>
            )}
          </button>
        </div>

        {/* Test Result Rows */}
        <div className="space-y-2">
          {testResults ? (
            testResults.tests.map((test: any, idx: number) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  test.passed 
                    ? 'bg-white border-slate-200 text-slate-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    {test.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-bold text-slate-900">{test.testName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 pl-6 font-sans">
                    {test.details}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 whitespace-nowrap pl-6 sm:pl-0">
                  {test.durationMs}ms
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400">
              Click "Run Automated Tests" to execute the test suite.
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
