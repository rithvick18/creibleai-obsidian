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
  setView: (view: 'chat' | 'security' | 'enterprise' | 'settings') => void;
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

      <aside className={`fixed left-0 top-0 h-full w-64 bg-[#1b1b20]/80 backdrop-blur-2xl flex flex-col py-8 border-r border-[#35343a]/20 z-40 pt-24 shadow-[20px_0_50px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-in-out ${
         isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="px-6 mb-8">
          <button 
            onClick={onNewChat}
            className="w-full py-3 rounded-xl bg-primary-container text-on-primary-container font-headline font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-1">
          <div className="text-[10px] font-label font-bold tracking-widest text-[#e4e1e9]/30 uppercase mb-4 px-2">Navigation</div>
          
          {sessions.length === 0 ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 opacity-50">
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span className="font-label tracking-wider uppercase text-[9px] font-bold">Get started to see history</span>
            </div>
          ) : (
            <button 
              onClick={() => setView('chat')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border-r-2 border-[#00E5FF] group transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[20px]">history</span>
              <span className="font-label tracking-wider uppercase text-[10px] font-bold">History / Chat</span>
            </button>
          )}

          <div className="mt-2 space-y-1 overflow-hidden">
            {sessions.map(session => (
              <div 
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                  currentSessionId === session.id 
                    ? 'bg-[#1f1f25] text-white shadow-sm' 
                    : 'text-[#e4e1e9]/50 hover:bg-[#1f1f25] hover:text-[#e4e1e9]'
                }`}
              >
                <div className="flex items-center gap-3 pr-2 overflow-hidden">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">chat_bubble</span>
                  <span className="truncate">{session.title || "Untitled Chat"}</span>
                </div>
                
                <button
                  onClick={(e) => onDeleteSession(e, session.id)}
                  className={`p-1 rounded-md hover:bg-[#35343a] hover:text-error text-on-surface-variant/50 opacity-0 group-hover:opacity-100 transition-opacity ${
                    currentSessionId === session.id ? 'opacity-100' : ''
                  }`}
                  title="Delete chat"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mt-auto border-t border-outline-variant/10 pt-6 space-y-1">
          <button onClick={() => setView('settings')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#e4e1e9]/50 hover:bg-[#1f1f25] hover:text-[#e4e1e9] transition-all duration-200">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="font-label tracking-wider uppercase text-[10px] font-bold">Settings</span>
          </button>
          <button onClick={() => setView('chat')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#e4e1e9]/50 hover:bg-[#1f1f25] hover:text-[#e4e1e9] transition-all duration-200">
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span className="font-label tracking-wider uppercase text-[10px] font-bold">Support</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default HistorySidebar;
