import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Bot, 
  Send, 
  Loader2, 
  AlertCircle, 
  BookOpen, 
  FileCode, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';

function FormattedMarkdown({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-sm font-bold text-white pt-2 pb-1 border-b border-slate-800">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-base font-bold text-indigo-300 pt-3 pb-1 border-b border-indigo-900/50">
              {trimmed.replace('## ', '')}
            </h3>
          );
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-indigo-400 font-bold shrink-0 mt-1">•</span>
              <div>{renderInlineFormatting(itemText)}</div>
            </div>
          );
        }
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }
        return <p key={idx}>{renderInlineFormatting(trimmed)}</p>;
      })}
    </div>
  );
}

function renderInlineFormatting(text) {
  // Regex to split bold and backtick codes
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 mx-0.5">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

const SAMPLE_QUESTIONS = [
  'What is the primary role of cmd/devlens/main.go?',
  'What scanner and analyzer logic is present in the codebase?',
  'Does this repository have any external dependencies?',
  'Where is technology detection implemented?'
];

export default function AIPreview({ analysisData }) {
  // Summary state
  const [summary, setSummary] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  // Q&A state
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState([]);
  const [qaError, setQaError] = useState(null);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummaryError(null);

    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: analysisData })
      });

      const data = await res.json();
      if (!res.ok || !data.available) {
        throw new Error(data.error || 'Failed to generate AI summary.');
      }
      setSummary(data.summary);
    } catch (err) {
      setSummaryError(err.message);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleAskQuestion = async (qText) => {
    const query = (qText || question).trim();
    if (!query) return;

    setIsAsking(true);
    setQaError(null);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          analysis: analysisData
        })
      });

      const data = await res.json();
      if (!res.ok || !data.available) {
        throw new Error(data.error || 'Failed to get answer from Gemini.');
      }

      setQaHistory((prev) => [
        {
          question: query,
          answer: data.answer,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
      setQuestion('');
    } catch (err) {
      setQaError(err.message);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. AI-Generated Repository Summary Card */}
      <div className="rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Architecture Summary</h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Google Gemini Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Executive architectural evaluation grounded strictly in repository scan artifacts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs transition-colors shadow-lg shadow-indigo-600/20 shrink-0"
          >
            {isGeneratingSummary ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Architecture...</span>
              </>
            ) : summary ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate Summary</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5" />
                <span>Generate AI Summary</span>
              </>
            )}
          </button>
        </div>

        {/* Summary Content */}
        {summary && (
          <div className="mt-5 p-5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <FormattedMarkdown text={summary} />
          </div>
        )}

        {summaryError && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <span className="font-semibold text-rose-200">Summary Generation Error: </span>
              <span>{summaryError}</span>
            </div>
          </div>
        )}

        {!summary && !isGeneratingSummary && !summaryError && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-400">
            Click <strong className="text-indigo-300 font-semibold">"Generate AI Summary"</strong> above to produce an executive architectural analysis of this codebase.
          </div>
        )}
      </div>

      {/* 2. Ask Your Codebase Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Ask Your Codebase</h3>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Context Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask natural-language questions. Answers are constrained strictly to verified repository files.
            </p>
          </div>
        </div>

        {/* Sample Question Chips */}
        <div>
          <span className="text-xs text-slate-400 font-medium mb-2.5 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            Example questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleAskQuestion(q)}
                disabled={isAsking}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 text-xs transition-colors text-left disabled:opacity-50"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Question Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about the repository structure or architecture..."
              disabled={isAsking}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isAsking || !question.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isAsking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Ask</span>
              </>
            )}
          </button>
        </form>

        {qaError && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <span className="font-semibold text-rose-200">Q&A Error: </span>
              <span>{qaError}</span>
            </div>
          </div>
        )}

        {/* Conversation Stream */}
        {qaHistory.length > 0 && (
          <div className="space-y-4 pt-2">
            {qaHistory.map((qa, index) => (
              <div
                key={index}
                className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3"
              >
                {/* User Question */}
                <div className="flex items-start justify-between gap-2 text-xs font-semibold text-slate-200 pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 text-indigo-300">
                    <span className="font-bold text-indigo-400">Q:</span>
                    <span>{qa.question}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-normal">
                    {qa.timestamp}
                  </span>
                </div>

                {/* Gemini Grounded Answer */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400">
                    <Bot className="w-3.5 h-3.5" />
                    <span>DevLens AI Answer</span>
                  </div>
                  <div className="pl-5 border-l-2 border-indigo-500/30">
                    <FormattedMarkdown text={qa.answer} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
