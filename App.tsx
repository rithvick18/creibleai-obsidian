import React, { useState, useEffect } from 'react';
import ContextPanel from './components/ContextPanel'; // Acts as Right Pane (Document)
import ChatPanel from './components/ResponseViewer'; // Acts as Left Pane (Chat)
import Header from './components/Header';
import AuthScreen from './components/AuthScreen';
import HistorySidebar from './components/HistorySidebar';
import CursorEffects from './components/CursorEffects';
import SecurityScreen from './components/SecurityScreen';
import EnterpriseScreen from './components/EnterpriseScreen';
import SettingsScreen from './components/SettingsScreen';
import { ChatMessage, ChatSession } from './types';
import { analyzeQuery } from './services/geminiService';
import { DEFAULT_CONTEXT } from './constants';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'chat' | 'security' | 'enterprise' | 'settings'>('chat');

  // Application State
  const [contextText, setContextText] = useState<string>(DEFAULT_CONTEXT);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'normal' | 'clinical' | 'legal'>('normal');

  // History State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Initialize Auth & History
  useEffect(() => {
    const session = localStorage.getItem('creible_session');
    if (session) {
      setIsAuthenticated(true);
    }

    const savedHistory = localStorage.getItem('creible_history');
    if (savedHistory) {
      try {
        setSessions(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    setIsAuthChecking(false);
  }, []);

  // Save history on change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('creible_history', JSON.stringify(sessions));
    }
  }, [sessions, isAuthenticated]);

  const handleLogin = () => {
    localStorage.setItem('creible_session', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('creible_session');
    setIsAuthenticated(false);
    setMessages([]);
    setCurrentQuery('');
    setMode('normal');
    setCurrentSessionId(null);
  };

  // Session Management
  const handleNewChat = () => {
    setMessages([]);
    setCurrentQuery('');
    setCurrentSessionId(null);
    // Optionally reset context if desired, but keeping previous context is usually better UX
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
      const result = await analyzeQuery(contextText, query, mode);
      
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

  if (isAuthChecking) {
    return <div className="h-screen w-screen bg-[#050505]"></div>;
  }

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const isPaneVisible = (mode === 'clinical' || mode === 'legal') && !isSidebarOpen;

  return (
    <div className="h-screen w-screen overflow-hidden font-body bg-[#131318] text-[#e4e1e9] selection:bg-primary/30 relative">
      <CursorEffects />

      <Header 
        mode={mode} 
        setMode={setMode} 
        onLogout={handleLogout} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        currentView={currentView}
        setView={setCurrentView}
      />

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
      <main className={`h-screen w-full flex flex-col relative transition-all duration-500 ${isSidebarOpen ? 'md:pl-64' : 'pl-0'}`}>
        
        {currentView === 'chat' && (
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

        {currentView === 'security' && <SecurityScreen />}
        {currentView === 'enterprise' && <EnterpriseScreen />}
        {currentView === 'settings' && <SettingsScreen />}

      </main>

    </div>
  );
};

export default App;
