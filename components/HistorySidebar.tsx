import React from 'react';
import { ChatSession } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (e: React.MouseEvent, id: string) => void;
  setView: (view: 'chat' | 'settings') => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  setView
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside className={`fixed left-0 top-0 h-full w-72 bg-[#131318] flex flex-col py-8 border-r border-white/5 z-40 shadow-[20px_0_50px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-in-out ${
         isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="mb-8 px-8">
          <div 
            onClick={() => setView('chat')}
            className="cursor-pointer group"
          >
            <h1 className="font-manrope font-extrabold text-[#e9feff] text-2xl tracking-tighter">CreibleAI</h1>
            <p className="text-on-surface-variant text-[10px] mt-1 uppercase tracking-widest opacity-50">The obsidian edition</p>
          </div>
        </div>

        <div className="px-6 mb-8">
          <button 
            onClick={onNewChat}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00E5FF]/20 to-[#00E5FF]/5 text-[#00E5FF] border border-[#00E5FF]/20 font-headline font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all active:scale-95 group"
          >
            <span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform duration-300">add</span>
            New Conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-1">
          <div className="text-[10px] font-label font-bold tracking-[0.2em] text-[#e4e1e9]/30 uppercase mb-4 px-4">Navigation</div>
          
          <button 
            onClick={() => { setView('chat'); onNewChat(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              !currentSessionId ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/10' : 'text-[#e4e1e9]/50 hover:bg-white/5 hover:text-[#e4e1e9]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="font-label tracking-wider uppercase text-[10px] font-bold">Dashboard</span>
          </button>

          <div className="pt-6 pb-2">
            <div className="text-[10px] font-label font-bold tracking-[0.2em] text-[#e4e1e9]/30 uppercase mb-4 px-4">Recent History</div>
          </div>

          <div className="space-y-1">
            {sessions.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed">No Recent<br/>Conversations</p>
              </div>
            ) : (
              sessions.map(session => (
                <div 
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl text-xs cursor-pointer transition-all border border-transparent ${
                    currentSessionId === session.id 
                      ? 'bg-white/5 text-white border-white/5 shadow-sm' 
                      : 'text-[#e4e1e9]/50 hover:bg-white/5 hover:text-[#e4e1e9]'
                  }`}
                >
                  <div className="flex items-center gap-3 pr-2 overflow-hidden">
                    <span className={`material-symbols-outlined text-[16px] ${currentSessionId === session.id ? 'text-[#00E5FF]' : 'text-on-surface-variant'}`}>
                      {currentSessionId === session.id ? 'chat_bubble' : 'bubble_chart'}
                    </span>
                    <span className="truncate font-medium">{session.title || "Untitled Chat"}</span>
                  </div>
                  
                  <button
                    onClick={(e) => onDeleteSession(e, session.id)}
                    className={`p-1.5 rounded-lg hover:bg-white/10 text-on-surface-variant/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all ${
                      currentSessionId === session.id ? 'opacity-100' : ''
                    }`}
                    title="Delete chat"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="px-4 mt-auto border-t border-white/[0.03] pt-6 space-y-1 pb-6">
          <button onClick={() => setView('settings')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#e4e1e9]/50 hover:bg-white/5 hover:text-[#e4e1e9] transition-all duration-200">
            <span className="material-symbols-outlined text-[20px]">settings_accessibility</span>
            <span className="font-label tracking-wider uppercase text-[10px] font-bold">Preferences</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default HistorySidebar;
