import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  Bot, 
  User, 
  HelpCircle, 
  AlertCircle, 
  Trash2, 
  Terminal,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';

function FormattedAnswer({ text }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div className="space-y-2 text-xs sm:text-sm text-neutral-800 dark:text-[#c9d1d9] leading-relaxed font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-[#f0f6fc] pt-2 pb-0.5 border-b border-neutral-200 dark:border-[#21262d]">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-sm font-bold text-neutral-900 dark:text-[#f0f6fc] pt-3 pb-1 border-b border-neutral-200 dark:border-[#30363d]">
              {trimmed.replace('## ', '')}
            </h3>
          );
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-neutral-400 dark:text-[#6e7681] font-bold mt-0.5">•</span>
              <div>{renderInline(itemText)}</div>
            </div>
          );
        }
        if (!trimmed) return <div key={idx} className="h-1" />;
        return <p key={idx}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

function renderInline(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-[#21262d] text-neutral-800 dark:text-[#79c0ff] border border-neutral-200 dark:border-[#30363d] mx-0.5">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-neutral-900 dark:text-[#f0f6fc]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

const TECHNICAL_PROMPTS = [
  'How are command-line flags and paths parsed?',
  'What directories and files does the scanner ignore?',
  'Where is technology and framework detection implemented?',
  'Are there any external dependencies in go.mod or package.json?'
];

export default function AskCodebaseTab({ 
  analysisData, 
  qaHistory, 
  onAskQuestion, 
  isAsking, 
  qaError, 
  onClearHistory 
}) {
  const [input, setInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isAsking) {
      onAskQuestion(input.trim());
      setInput('');
    }
  };

  const handleSelectPrompt = (promptText) => {
    onAskQuestion(promptText);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Query Bar */}
      <div className="rounded-lg border border-neutral-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-neutral-500 dark:text-[#8b949e]" />
            <span className="text-xs font-semibold text-neutral-900 dark:text-[#f0f6fc]">
              Query Codebase Context
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-[#8b949e]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#3fb950]" />
            <span>Strictly grounded in repository scan</span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Where is technology detection implemented in internal/analyzer?"
              disabled={isAsking}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded border border-neutral-300 dark:border-[#30363d] bg-neutral-50 dark:bg-[#0d1117] text-neutral-900 dark:text-[#f0f6fc] placeholder-neutral-400 dark:placeholder-[#6e7681] focus:outline-none focus:border-blue-500 disabled:opacity-50 font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={isAsking || !input.trim()}
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded border border-neutral-900 dark:border-[#30363d] bg-neutral-900 dark:bg-[#21262d] hover:bg-neutral-800 dark:hover:bg-[#30363d] text-white dark:text-[#f0f6fc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center gap-1.5"
          >
            {isAsking ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </>
            )}
          </button>
        </form>

        {/* Prompt Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-neutral-400 dark:text-[#6e7681] mr-1">
            Sample inquiries:
          </span>
          {TECHNICAL_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSelectPrompt(prompt)}
              disabled={isAsking}
              className="px-2.5 py-1 text-[11px] rounded bg-neutral-100 dark:bg-[#21262d] hover:bg-neutral-200 dark:hover:bg-[#30363d] text-neutral-700 dark:text-[#c9d1d9] border border-neutral-200 dark:border-[#30363d] transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {qaError && (
        <div className="p-3.5 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Query Failed</p>
            <p className="mt-0.5">{qaError}</p>
          </div>
        </div>
      )}

      {/* Inquiry Thread / History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-[#8b949e] px-1">
          <span>Investigation Thread</span>
          {qaHistory && qaHistory.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-neutral-400 dark:text-[#6e7681] hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear thread</span>
            </button>
          )}
        </div>

        {qaHistory && qaHistory.length > 0 ? (
          qaHistory.map((item, idx) => (
            <div 
              key={idx}
              className="rounded-lg border border-neutral-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] p-4 space-y-3"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-neutral-100 dark:border-[#21262d]">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-neutral-100 dark:bg-[#21262d] text-neutral-600 dark:text-[#8b949e] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-[#f0f6fc]">
                      {item.question}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-neutral-400 dark:text-[#6e7681] font-mono">
                    {item.timestamp}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.answer, idx)}
                    className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-[#c9d1d9]"
                    title="Copy response"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#3fb950]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Answer Content */}
              <div className="flex items-start gap-2.5 pt-1">
                <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-[#58a6ff] flex items-center justify-center shrink-0 mt-0.5 border border-blue-200 dark:border-blue-900/50">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-[#6e7681]">
                    Grounded Answer
                  </span>
                  <FormattedAnswer text={item.answer} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center rounded-lg border border-dashed border-neutral-200 dark:border-[#30363d] bg-white/50 dark:bg-[#161b22]/30 p-6">
            <MessageSquare className="w-6 h-6 text-neutral-400 dark:text-[#6e7681] mx-auto mb-2" />
            <h4 className="text-xs font-semibold text-neutral-700 dark:text-[#c9d1d9]">
              No questions asked for this repository yet
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-[#8b949e] mt-1 max-w-sm mx-auto">
              Ask technical questions about the scanned codebase. Answers are restricted to verified manifests, entry files, and directory artifacts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
