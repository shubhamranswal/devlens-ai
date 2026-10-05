import React from 'react';
import { Lightbulb, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export default function ObservationsList({ observations }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <div>
          <h3 className="text-base font-bold text-white">Engineering Observations & Health</h3>
          <p className="text-xs text-slate-400">Tooling maturity, testing posture, and practices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {observations && observations.length > 0 ? (
          observations.map((obs, idx) => {
            const isPos = obs.status === 'positive';
            const isInfo = obs.status === 'info';

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3"
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                    isPos
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : isInfo
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}
                >
                  {isPos ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isInfo ? (
                    <Info className="w-3.5 h-3.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{obs.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{obs.detail}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-500 italic p-3">No specific observations noted.</p>
        )}
      </div>
    </div>
  );
}
