import React from 'react';
import { Compass, Network, Play, FileCode, CheckCircle, ArrowRight } from 'lucide-react';

export default function ArchitectureView({ architecture }) {
  const { pattern, description, components, entryPoints } = architecture;

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Pattern Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/20">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Architecture Pattern
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">{pattern}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">{description}</p>
          </div>
        </div>
      </div>

      {/* Component Responsibilities */}
      {components && components.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
            <Network className="w-4 h-4 text-cyan-400" />
            Core Architectural Layers
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {components.map((comp) => (
              <div
                key={comp.name}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">{comp.name}</h5>
                  <p className="text-xs text-slate-400 mt-0.5">{comp.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Entry Points List */}
      <div>
        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
          <Play className="w-4 h-4 text-emerald-400" />
          Detected Execution Entry Points
        </h4>

        {entryPoints && entryPoints.length > 0 ? (
          <div className="divide-y divide-slate-800 rounded-xl bg-slate-950/60 border border-slate-800 overflow-hidden">
            {entryPoints.map((entry) => (
              <div
                key={entry.path}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileCode className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-mono text-xs text-indigo-300 font-semibold">
                    {entry.path}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {entry.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {entry.language}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic p-3 rounded-lg bg-slate-800/30">
            No standard entry files identified in root directories
          </p>
        )}
      </div>
    </div>
  );
}
