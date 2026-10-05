import React from 'react';
import { Sun, Moon, Search, Terminal } from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  onNewSearch, 
  currentRepo, 
  isLoading 
}) {
  return (
    <header className="border-b border-neutral-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            type="button"
            onClick={onNewSearch}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus:outline-none"
            title="DevLens AI Home"
          >
            <img 
              src="/icon_no_bg.png" 
              alt="DevLens" 
              className="w-6 h-6 object-contain"
              onError={(e) => {
                // Fallback to icon.png if no_bg fails
                e.target.onerror = null;
                e.target.src = '/icon.png';
              }}
            />
            <div className="flex items-center gap-1.5 font-semibold text-sm tracking-tight text-neutral-900 dark:text-[#f0f6fc]">
              <span>DevLens</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#21262d] text-neutral-600 dark:text-[#8b949e] border border-neutral-200 dark:border-[#30363d]">
                AI
              </span>
            </div>
          </button>
        </div>

        {/* Middle: Active Repo Indicator or Quick Switcher */}
        {currentRepo && (
          <div className="hidden md:flex items-center gap-2 text-xs text-neutral-500 dark:text-[#8b949e] max-w-md truncate">
            <Terminal className="w-3.5 h-3.5 text-neutral-400 dark:text-[#6e7681]" />
            <span className="font-mono text-neutral-800 dark:text-[#c9d1d9] truncate font-medium">
              {currentRepo}
            </span>
            <button
              type="button"
              onClick={onNewSearch}
              className="text-[11px] text-blue-600 dark:text-[#58a6ff] hover:underline ml-1"
            >
              change
            </button>
          </div>
        )}

        {/* Right Tools: Theme & GitHub */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {currentRepo && (
            <button
              type="button"
              onClick={onNewSearch}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-neutral-300 dark:border-[#30363d] bg-neutral-50 dark:bg-[#21262d] hover:bg-neutral-100 dark:hover:bg-[#30363d] text-neutral-700 dark:text-[#c9d1d9] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Repo</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 rounded border border-neutral-200 dark:border-[#30363d] hover:bg-neutral-100 dark:hover:bg-[#21262d] text-neutral-600 dark:text-[#8b949e] hover:text-neutral-900 dark:hover:text-[#f0f6fc] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <a
            href="https://github.com/shubhamranswal/devlens"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded border border-neutral-200 dark:border-[#30363d] hover:bg-neutral-100 dark:hover:bg-[#21262d] text-neutral-600 dark:text-[#8b949e] hover:text-neutral-900 dark:hover:text-[#f0f6fc] transition-colors"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
