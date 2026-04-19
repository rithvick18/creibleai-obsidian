import React, { useState, useEffect } from 'react';
import ContextPanel from './components/ContextPanel';
import ChatPanel from './components/ResponseViewer';
import Header from './components/Header';
import HistorySidebar from './components/HistorySidebar';
import CursorEffects from './components/CursorEffects';
import SettingsScreen from './components/SettingsScreen';
import SettingsModal from './components/SettingsModal';
import Dashboard from './components/Dashboard';
import { ChatMessage, ChatSession, AppSettings } from './types';
import { analyzeQuery } from './services/aiService';
import { DEFAULT_CONTEXT } from './constants';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(false);

  // Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'chat' | 'settings'>('chat');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Application State
  const [contextText, setContextText] = useState<string>(DEFAULT_CONTEXT);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'normal' | 'clinical' | 'legal'>('normal');

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('creible_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      provider: 'gemini',
      geminiKey: '',
      mistralKey: '',
      grokKey: '',
      geminiModel: 'gemini-2.5-flash',
      mistralModel: 'mistral-large-latest'
    };
  });

  // History State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Initialize Auth & History
  useEffect(() => {
    const savedHistory = localStorage.getItem('creible_history');
    if (savedHistory) {
      try {
        setSessions(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('creible_history', JSON.stringify(sessions));
    }
  }, [sessions, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('creible_settings', JSON.stringify(settings));
  }, [settings]);



  // Session Management
  const handleNewChat = (initialPrompt: string = '') => {
    setMessages([]);
    setCurrentQuery(initialPrompt);
    setCurrentSessionId(null);
    if (initialPrompt) {
      // If there's an initial prompt, trigger send after a brief delay to allow state to update
      setTimeout(() => {
        handleSendWithQuery(initialPrompt);
      }, 0);
    }
  };

  // Helper: get active key for the current provider
  const getActiveKey = (s: AppSettings): string => {
    if (s.provider === 'gemini') return s.geminiKey;
    if (s.provider === 'mistral') return s.mistralKey;
    return s.grokKey;
  };

  const handleSendWithQuery = async (query: string) => {
    if (!query.trim() || isLoading) return;

    // Auto-open settings modal if no API key is saved
    if (!getActiveKey(settings).trim()) {
      setIsSettingsModalOpen(true);
      return;
    }

    setCurrentQuery('');
    setIsLoading(true);

    // Create User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: Date.now()
    };
    
    // Optimistic Update for UI
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Handle Session Creation/Update immediately for user message
    let sessionId = currentSessionId;
    let currentSessionList = [...sessions];

    if (!sessionId) {
      sessionId = Date.now().toString();
      setCurrentSessionId(sessionId);
      const newSession: ChatSession = {
        id: sessionId,
        title: query.slice(0, 30) + (query.length > 30 ? '...' : ''),
        messages: updatedMessages,
        timestamp: Date.now(),
        mode: mode
      };
      currentSessionList = [newSession, ...currentSessionList];
    } else {
      currentSessionList = currentSessionList.map(s => 
        s.id === sessionId ? { ...s, messages: updatedMessages, timestamp: Date.now() } : s
      );
      // Move current session to top
      const currentSession = currentSessionList.find(s => s.id === sessionId);
      if (currentSession) {
         currentSessionList = [currentSession, ...currentSessionList.filter(s => s.id !== sessionId)];
      }
    }
    setSessions(currentSessionList);

    try {
      const result = await analyzeQuery(contextText, query, mode, settings, undefined, messages);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.answer,
        thinking: result.thinking,
        verificationStatus: result.verificationStatus,
        sources: result.sources,
        timestamp: Date.now()
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // Final update to session with AI response
      setSessions(prev => {
        const list = prev.map(s => 
          s.id === sessionId ? { ...s, messages: finalMessages } : s
        );
        // Ensure order is preserved (active on top)
        const active = list.find(s => s.id === sessionId);
        const rest = list.filter(s => s.id !== sessionId);
        return active ? [active, ...rest] : list;
      });

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message || "An unexpected error occurred."}`,
        timestamp: Date.now()
      };
      const errorMessages = [...updatedMessages, errorMsg];
      setMessages(errorMessages);
      
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, messages: errorMessages } : s
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setMessages(session.messages);
      setMode(session.mode);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false); // Close sidebar on mobile on selection
      }
    }
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (currentSessionId === id) {
      handleNewChat();
    }
  };

  const handleSend = async () => {
    if (!currentQuery.trim() || isLoading) return;

    // Auto-open settings modal if no API key is saved
    if (!getActiveKey(settings).trim()) {
      setIsSettingsModalOpen(true);
      return;
    }

    const query = currentQuery;
    setCurrentQuery('');
    setIsLoading(true);

    // Create User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: Date.now()
    };
    
    // Optimistic Update for UI
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Handle Session Creation/Update immediately for user message
    let sessionId = currentSessionId;
    let currentSessionList = [...sessions];

    if (!sessionId) {
      sessionId = Date.now().toString();
      setCurrentSessionId(sessionId);
      const newSession: ChatSession = {
        id: sessionId,
        title: query.slice(0, 30) + (query.length > 30 ? '...' : ''),
        messages: updatedMessages,
        timestamp: Date.now(),
        mode: mode
      };
      currentSessionList = [newSession, ...currentSessionList];
    } else {
      currentSessionList = currentSessionList.map(s => 
        s.id === sessionId ? { ...s, messages: updatedMessages, timestamp: Date.now() } : s
      );
      // Move current session to top
      const currentSession = currentSessionList.find(s => s.id === sessionId);
      if (currentSession) {
         currentSessionList = [currentSession, ...currentSessionList.filter(s => s.id !== sessionId)];
      }
    }
    setSessions(currentSessionList);

    try {
      const result = await analyzeQuery(contextText, query, mode, settings, undefined, messages);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.answer,
        thinking: result.thinking,
        verificationStatus: result.verificationStatus,
        sources: result.sources,
        timestamp: Date.now()
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // Final update to session with AI response
      setSessions(prev => {
        const list = prev.map(s => 
          s.id === sessionId ? { ...s, messages: finalMessages } : s
        );
        // Ensure order is preserved (active on top)
        const active = list.find(s => s.id === sessionId);
        const rest = list.filter(s => s.id !== sessionId);
        return active ? [active, ...rest] : list;
      });

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message || "An unexpected error occurred."}`,
        timestamp: Date.now()
      };
      const errorMessages = [...updatedMessages, errorMsg];
      setMessages(errorMessages);
      
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, messages: errorMessages } : s
      ));
    } finally {
      setIsLoading(false);
    }
  };



  const isPaneVisible = (mode === 'clinical' || mode === 'legal') && !isSidebarOpen;
  const showDashboard = currentView === 'chat' && messages.length === 0;

  return (
    <div className="h-screen w-screen overflow-hidden font-body bg-[#131318] text-[#e4e1e9] selection:bg-primary/30 relative">
      <CursorEffects />

      {currentView !== 'settings' && (
        <Header 
          mode={mode} 
          setMode={setMode} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          currentView={currentView}
          setView={setCurrentView}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />
      )}

      <HistorySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={(id) => { handleSelectSession(id); setCurrentView('chat'); }}
        onNewChat={() => { handleNewChat(); setCurrentView('chat'); }}
        onDeleteSession={handleDeleteSession}
        setView={setCurrentView}
      />

      {/* Main Content Canvas */}
      <main className={`h-screen w-full flex flex-col relative transition-all duration-500 ${isSidebarOpen ? 'md:pl-72' : 'pl-0'}`}>
        
        {showDashboard && (
          <Dashboard 
            onNewChat={(prompt) => { handleNewChat(prompt); setCurrentView('chat'); }}
            setView={setCurrentView}
            settings={settings}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            mode={mode}
            setMode={setMode}
          />
        )}

        {currentView === 'chat' && !showDashboard && (
          <div className={`flex-1 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 pt-20 ${isPaneVisible ? 'md:pr-[400px]' : ''}`}>
            <ChatPanel 
              messages={messages} 
              currentQuery={currentQuery} 
              setCurrentQuery={setCurrentQuery} 
              onSend={handleSend}
              isLoading={isLoading}
              mode={mode}
              setMode={setMode}
              isSidebarOpen={isSidebarOpen}
              isPaneVisible={isPaneVisible}
              setView={setCurrentView}
              setContextText={setContextText}
              onCloseSidebar={() => setIsSidebarOpen(false)}
            />
            
            {(mode === 'clinical' || mode === 'legal') && (
               <div className={`fixed right-0 top-20 bottom-0 w-full md:w-[400px] bg-[#131318]/90 backdrop-blur-3xl border-l border-white/5 transition-all duration-500 ease-in-out transform shadow-2xl z-20 ${isPaneVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
                 <ContextPanel 
                   contextText={contextText} 
                   setContextText={setContextText}
                 />
               </div>
            )}
          </div>
        )}

        {currentView === 'settings' && <SettingsScreen settings={settings} setSettings={setSettings} />}

      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />

    </div>
  );
};

export default App;
