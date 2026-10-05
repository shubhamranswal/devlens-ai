import React from 'react';
import { 
  GitFork, 
  Star, 
  CircleDot, 
  FileCode2, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  Code2,
  Box
} from 'lucide-react';

const LANG_COLORS = {
  JavaScript: 'bg-amber-400',
  TypeScript: 'bg-blue-500',
  Go: 'bg-cyan-500',
  Python: 'bg-emerald-500',
  Rust: 'bg-orange-500',
  Java: 'bg-red-500',
  HTML: 'bg-rose-400',
  CSS: 'bg-sky-400'
};

export default function OverviewCard({ data }) {
  const { repository, metrics, projectType, techStack } = data;

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5" />
              {projectType}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              Branch: {repository.branch}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>{repository.fullName}</span>
            <a
              href={repository.url}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-indigo-400 transition-colors p-1"
              title="Open on GitHub"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </h2>
          <p className="mt-1.5 text-sm text-slate-400 max-w-3xl leading-relaxed">
            {repository.description}
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white">{repository.stars.toLocaleString()}</span>
            <span className="text-slate-400">stars</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <GitFork className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-white">{repository.forks.toLocaleString()}</span>
            <span className="text-slate-400">forks</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white">{repository.openIssues}</span>
            <span className="text-slate-400">issues</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-800">
        <div>
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
            Total Files
          </span>
          <p className="text-xl font-bold text-white mt-1">{metrics.totalFiles}</p>
        </div>
        <div>
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-slate-400" />
            Directories
          </span>
          <p className="text-xl font-bold text-white mt-1">{metrics.totalDirectories}</p>
        </div>
        <div>
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            License
          </span>
          <p className="text-xl font-bold text-white mt-1">{repository.license}</p>
        </div>
        <div>
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Scan Latency
          </span>
          <p className="text-xl font-bold text-indigo-300 mt-1">{metrics.analysisTimeMs}ms</p>
        </div>
      </div>

      {/* Language Composition Bar */}
      {techStack.languages.length > 0 && (
        <div className="pt-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Language Distribution</span>
            <span className="text-slate-400 font-mono">
              Primary: <span className="text-slate-200 font-semibold">{techStack.languages[0]?.name}</span>
            </span>
          </div>

          {/* Progress segments */}
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex">
            {techStack.languages.map((lang) => (
              <div
                key={lang.name}
                style={{ width: `${Math.max(lang.percentage, 3)}%` }}
                className={`h-full ${LANG_COLORS[lang.name] || 'bg-slate-500'}`}
                title={`${lang.name}: ${lang.percentage}% (${lang.count} files)`}
              />
            ))}
          </div>

          {/* Language chips */}
          <div className="flex flex-wrap gap-3 mt-3">
            {techStack.languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className={`w-2.5 h-2.5 rounded-full ${LANG_COLORS[lang.name] || 'bg-slate-500'}`} />
                <span className="font-medium">{lang.name}</span>
                <span className="text-slate-400">({lang.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
