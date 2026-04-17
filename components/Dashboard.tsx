import React, { useEffect, useState } from 'react';
import { AppSettings } from '../types';

interface DashboardProps {
  onNewChat: (prompt: string) => void;
  setView: (view: 'chat' | 'settings') => void;
  settings: AppSettings;
  onOpenSettings: () => void;
  mode: 'normal' | 'clinical' | 'legal';
  setMode: (mode: 'normal' | 'clinical' | 'legal') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNewChat, setView, settings, onOpenSettings, mode, setMode }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Derive a human-readable label from current settings
  const PROVIDER_LABELS: Record<string, string> = {
    gemini: 'Gemini',
    mistral: 'Mistral',
    grok: 'Grok',
  };
  const providerLabel = PROVIDER_LABELS[settings.provider] ?? settings.provider;
  const modelLabel =
    settings.provider === 'gemini'
      ? settings.geminiModel
      : settings.provider === 'mistral'
      ? settings.mistralModel
      : 'grok-3'; // default display for Grok
  const hasKey =
    settings.provider === 'gemini'
      ? !!settings.geminiKey
      : settings.provider === 'mistral'
      ? !!settings.mistralKey
      : !!(settings as any).grokKey;

  const suggestedPrompts = [
    'Explain quantum computing',
    'Write a Python script for web scraping',
    'Analyze my latest PDF',
    'Brainstorm startup ideas'
  ];

  const handleSend = () => {
    if (inputValue.trim()) {
      onNewChat(inputValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsTyping(value.length > 0);
  };

  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <div 
      className="text-on-surface font-body h-screen flex overflow-hidden app-grid-surface" 
      style={{
        backgroundColor: '#131318'
      }}
    >
      <style>{`
        .glass-panel {
            background-color: rgba(31, 31, 37, 0.75);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        @keyframes dashboardFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dashboardOrbFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-12px) scale(1.02);
          }
        }

        @keyframes dashboardOrbPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes dashboardOrbSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes dashboardGlowShift {
          0%, 100% {
            transform: scale(1);
            opacity: 0.34;
          }
          50% {
            transform: scale(1.16);
            opacity: 0.56;
          }
        }

        .dashboard-reveal {
          opacity: 0;
          transform: translateY(28px);
        }

        .dashboard-reveal-ready {
          animation: dashboardFadeUp 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .dashboard-orb-shell {
          animation: dashboardOrbFloat 6s ease-in-out infinite;
          will-change: transform;
        }

        .dashboard-orb-glow {
          animation: dashboardGlowShift 4.5s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .dashboard-orb-rotor {
          animation: dashboardOrbSpin 28s linear infinite;
          transform-origin: center;
          will-change: transform;
        }

        .dashboard-orb-image {
          filter: brightness(1.22) saturate(1.18) contrast(1.08) drop-shadow(0 0 22px rgba(0, 245, 255, 0.35));
          will-change: transform, opacity;
        }

        .dashboard-orb-image-typing {
          animation: dashboardOrbPulse 1.8s ease-in-out infinite;
        }

        .dashboard-icon-button {
          border-radius: 9999px;
        }

        .dashboard-cta-button {
          border-radius: 1.5rem;
        }

        .dashboard-nav-item {
          border-radius: 1.25rem;
        }
      `}</style>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0 h-screen relative">
        {/* Center Stage */}
        <div className={`flex-1 flex flex-col items-center justify-center p-6 sm:p-12 max-w-4xl mx-auto w-full mb-24 dashboard-reveal ${isReady ? 'dashboard-reveal-ready' : ''}`}>
          {/* Abstract Orb Illustration (CSS Driven) */}
          <div className="relative w-48 h-48 mb-12 dashboard-orb-shell">
            <div className={`absolute -inset-3 bg-primary-container rounded-full blur-[96px] transition-all duration-500 dashboard-orb-glow ${isTyping ? 'opacity-65 scale-115' : 'opacity-40'}`}></div>
            <div className={`absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(120,255,255,0.26)_0%,rgba(0,245,255,0.12)_42%,transparent_74%)] blur-[24px] transition-all duration-500 ${isTyping ? 'opacity-100 scale-110' : 'opacity-80'}`}></div>
            <div className={`absolute inset-4 bg-gradient-to-tr from-secondary to-primary-fixed-dim rounded-full blur-[34px] transition-all duration-500 ${isTyping ? 'opacity-75 scale-110' : 'opacity-52'}`}></div>
            <div className="relative z-10 w-full h-full dashboard-orb-rotor">
              <img 
                alt="Abstract geometric dark 3D sphere with subtle cyan neon lighting reflections" 
                className={`w-full h-full object-cover rounded-full mix-blend-screen transition-all duration-500 dashboard-orb-image ${isTyping ? 'opacity-100 scale-110 dashboard-orb-image-typing' : 'opacity-95'}`} 
                data-alt="Abstract geometric dark 3D sphere with subtle cyan neon lighting reflections on black background" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA48Rd2SqXF9P6LaDLpHUJzFUbl0WXJWJVwxWCm0YmBSRk7GL9rD9o_unPqKWMSd0TSkClcVQIZR6v__MEFlFx4mXGqGXEUr0cIUU6GllL4os-ssgq-tpjTGEyaJya3HJUnuAga-NwujZApBpRiXhQiWhMrXMgzGMi9MXKu_gZgb2o52v2hoNWm7A6MsCmy7afx8S_Yn4N6wZTvGMy9s7PX4ujQgPC1dtI6HDPPffMyK0zOY5D3BVH1e6EH1rlNlbbdLV71bDEicA"
              />
            </div>
          </div>
          
          <h2 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-4 text-center tracking-tight" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
            What would you like to explore today?
          </h2>
          
          <p className="text-on-surface-variant text-sm sm:text-base mb-12 flex items-center gap-2 cursor-pointer group" onClick={onOpenSettings} title="Change provider">
            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_#00f5ff] transition-colors duration-300 ${hasKey ? 'bg-primary-container' : 'bg-yellow-500/70 shadow-[0_0_8px_rgba(234,179,8,0.6)]'}`}></span>
            <span className="group-hover:text-primary transition-colors duration-200">
              {hasKey ? `Connected · ${providerLabel} · ${modelLabel}` : `No key set · ${providerLabel} — click to configure`}
            </span>
            <span className="material-symbols-outlined text-[14px] opacity-30 group-hover:opacity-70 transition-opacity">edit</span>
          </p>
          
          {/* Suggested Prompt Chips */}
          <div className="flex flex-wrap justify-center gap-3 w-full max-w-2xl">
            {suggestedPrompts.map((prompt, index) => (
              <button 
                key={index}
                onClick={() => onNewChat(prompt)}
                className="bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs sm:text-sm py-2.5 px-5 rounded-full transition-colors duration-200 flex items-center gap-2 border border-transparent hover:border-outline-variant/30"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        
        {/* Fixed Bottom Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 bg-gradient-to-t from-[#131318] via-[#131318]/95 to-transparent pointer-events-none">
          <div className="max-w-3xl mx-auto relative pointer-events-auto">
            <div className="group relative">
               {/* Enhanced background glow on focus */}
               <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-container/20 to-secondary/20 rounded-[28px] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
               
               <div className="relative flex flex-col glass-panel rounded-[24px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-500 group-focus-within:border-primary-container/40 group-focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,245,255,0.03)]">
                 
                 {/* Top Toolbar */}
                 <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
                   <div className="flex items-center gap-2">
                     <div 
                       onClick={() => {
                         if (mode === 'normal') setMode('clinical');
                         else if (mode === 'clinical') setMode('legal');
                         else setMode('normal');
                       }} 
                       className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low/60 border border-white/5 cursor-pointer hover:border-primary-container/40 transition-all active:scale-95 group/mode shadow-inner"
                     >
                       <span className="material-symbols-outlined text-[14px] text-primary-container">
                         {mode === 'clinical' ? 'stethoscope' : mode === 'legal' ? 'balance' : 'rocket_launch'}
                       </span>
                       <span className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest">{mode} Mode</span>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-4">
                     <button className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant/50 hover:text-primary-container uppercase tracking-widest transition-colors">
                       <span className="material-symbols-outlined text-[16px]">attach_file</span>
                       Attach
                     </button>
                     <div className="w-[1px] h-3 bg-white/10"></div>
                     <button onClick={onOpenSettings} className="material-symbols-outlined text-[18px] text-on-surface-variant/50 hover:text-on-surface transition-colors">settings</button>
                   </div>
                 </div>

                 {/* Textarea Area */}
                 <div className="flex items-end gap-3 p-4 px-5">
                   <textarea 
                     className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder-on-surface-variant/30 text-base font-body min-h-[44px] max-h-[200px] py-2.5 resize-none custom-scrollbar leading-relaxed" 
                     placeholder="Ask CreibleAI anything..." 
                     rows={1}
                     value={inputValue}
                     onChange={(e) => {
                       handleInputChange(e as any);
                       e.target.style.height = 'auto';
                       e.target.style.height = `${e.target.scrollHeight}px`;
                     }}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                     }}
                   />
                   
                   <div className="flex items-center gap-2 pb-1">
                     <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-on-surface hover:bg-white/5 transition-all">
                       <span className="material-symbols-outlined text-[20px]">mic</span>
                     </button>
                     
                     <button 
                       onClick={handleSend}
                       disabled={!inputValue.trim()}
                       className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                         inputValue.trim() 
                         ? 'bg-primary-container text-surface shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] hover:scale-105 active:scale-95' 
                         : 'bg-surface-container-highest text-on-surface-variant/30'
                       }`}
                     >
                       <span className="material-symbols-outlined font-black text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
                     </button>
                   </div>
                 </div>
               </div>
            </div>
            
            <div className="text-center mt-5 text-[9px] text-on-surface-variant/40 font-bold uppercase tracking-[0.2em] opacity-60">
              Precise & Verified Response Engine
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
