import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RepoHeader from './components/RepoHeader';
import RepoInput from './components/RepoInput';
import AnalysisProgress from './components/AnalysisProgress';
import OverviewTab from './components/Tabs/OverviewTab';
import ArchitectureTab from './components/Tabs/ArchitectureTab';
import FilesTab from './components/Tabs/FilesTab';
import AskCodebaseTab from './components/Tabs/AskCodebaseTab';

export default function App() {
  // Theme state: default 'dark', persisted in localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('devlens_theme') || 'dark';
  });

  // Analysis state
  const [analysisData, setAnalysisData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'architecture' | 'files' | 'ask'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // AI Summary state
  const [summary, setSummary] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  // Ask Codebase state
  const [qaHistory, setQaHistory] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [qaError, setQaError] = useState(null);

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('devlens_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAnalyze = async (repoUrl) => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    setSummaryError(null);
    setQaHistory([]);
    setQaError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: repoUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze repository');
      }

      setAnalysisData(data);
      setActiveTab('overview');
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during analysis');
      setAnalysisData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!analysisData) return;
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

  const handleAskQuestion = async (query) => {
    if (!analysisData || !query.trim()) return;
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
        throw new Error(data.error || 'Failed to retrieve answer from Gemini.');
      }

      setQaHistory(prev => [
        {
          question: query,
          answer: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    } catch (err) {
      setQaError(err.message);
    } finally {
      setIsAsking(false);
    }
  };

  const handleClearQA = () => {
    setQaHistory([]);
    setQaError(null);
  };

  const handleNewSearch = () => {
    setAnalysisData(null);
    setError(null);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0d1117] text-neutral-900 dark:text-[#c9d1d9] flex flex-col font-sans transition-colors">
      {/* 1. Global Application Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onNewSearch={handleNewSearch}
        currentRepo={analysisData?.repository?.fullName}
        isLoading={isLoading}
      />

      {/* 2. Repository Workspace Header (Shown when repository is analyzed) */}
      {analysisData && !isLoading && (
        <RepoHeader
          analysisData={analysisData}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      )}

      {/* 3. Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* State A: Loading in progress */}
        {isLoading && <AnalysisProgress />}

        {/* State B: Empty initial state (No repo loaded yet) */}
        {!analysisData && !isLoading && (
          <RepoInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            error={error}
          />
        )}

        {/* State C: Active Repository Workspace with Tabs */}
        {analysisData && !isLoading && (
          <div className="animate-in fade-in duration-200">
            {activeTab === 'overview' && (
              <OverviewTab
                analysisData={analysisData}
                summary={summary}
                isGeneratingSummary={isGeneratingSummary}
                summaryError={summaryError}
                onGenerateSummary={handleGenerateSummary}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'architecture' && (
              <ArchitectureTab analysisData={analysisData} />
            )}

            {activeTab === 'files' && (
              <FilesTab
                structure={analysisData.structure}
                totalFiles={analysisData.metrics.totalFiles}
              />
            )}

            {activeTab === 'ask' && (
              <AskCodebaseTab
                analysisData={analysisData}
                qaHistory={qaHistory}
                onAskQuestion={handleAskQuestion}
                isAsking={isAsking}
                qaError={qaError}
                onClearHistory={handleClearQA}
              />
            )}
          </div>
        )}
      </main>

      {/* Developer Tool Minimal Footer */}
      <footer className="border-t border-neutral-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] py-4 text-xs text-neutral-500 dark:text-[#8b949e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800 dark:text-[#f0f6fc]">DevLens AI</span>
            <span>•</span>
            <span>Codebase Architecture & Ingestion Engine</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>v1.0.0</span>
            <span>•</span>
            <a
              href="https://github.com/shubhamranswal/devlens"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-[#58a6ff] hover:underline"
            >
              GitHub Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
