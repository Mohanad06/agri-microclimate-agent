import React, { useState, useEffect, useCallback } from 'react';
import useAgent from './hooks/useAgent.js';
import Header from './components/common/Header.jsx';
import BrandIntro from './components/common/BrandIntro.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AnalyzePage from './pages/AnalyzePage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import AgentIntelligencePage from './pages/AgentIntelligencePage.jsx';
import './App.css';

/**
 * Main Agri Microclimate Agent Application Component.
 * Integrates BrandIntro splash reveal and Light-First AgriTech visual identity.
 */
function App() {
  const {
    apiStatus,
    crops,
    formData,
    analysisResult,
    loading,
    error,
    auditModalOpen,
    setAuditModalOpen,
    handleFormChange,
    submitAnalysis: rawSubmitAnalysis,
  } = useAgent();

  // Page Routing State ('/' | '/analyze' | '/results' | '/agent')
  const [currentPath, setCurrentPath] = useState('/');
  const [introKey, setIntroKey] = useState(0);

  // Sync route with window.location.hash on mount and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'analyze') setCurrentPath('/analyze');
      else if (hash === 'results') setCurrentPath('/results');
      else if (hash === 'agent') setCurrentPath('/agent');
      else setCurrentPath('/');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = useCallback((path) => {
    setCurrentPath(path);
    const hash = path.replace('/', '');
    if (hash) {
      window.location.hash = hash;
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReplayIntro = useCallback(() => {
    setIntroKey((prev) => prev + 1);
  }, []);

  // Wrap submitAnalysis to auto-navigate to /results upon successful backend response
  const handleFormSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      await rawSubmitAnalysis(e);
      handleNavigate('/results');
    },
    [rawSubmitAnalysis, handleNavigate]
  );

  return (
    <div className="app-shell">
      {/* Animated Brand Splash Intro with progress bar */}
      <BrandIntro key={introKey} />

      {/* Top Header with live API connection status and navigation links */}
      <Header
        apiStatus={apiStatus}
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />

      {/* Main Page Container */}
      <main className="page-container">
        {currentPath === '/' && (
          <DashboardPage onNavigate={handleNavigate} />
        )}

        {currentPath === '/analyze' && (
          <AnalyzePage
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            crops={crops}
            loading={loading}
            error={error}
          />
        )}

        {currentPath === '/results' && (
          <ResultsPage
            analysisResult={analysisResult}
            onNavigate={handleNavigate}
            auditModalOpen={auditModalOpen}
            setAuditModalOpen={setAuditModalOpen}
          />
        )}

        {currentPath === '/agent' && (
          <AgentIntelligencePage onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}

export default App;
