import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ChatPanelProps {
  messages: ChatMessage[];
  currentQuery: string;
  setCurrentQuery: (q: string) => void;
  onSend: () => void;
  isLoading: boolean;
  mode: 'normal' | 'clinical' | 'legal';
  setMode: (mode: 'normal' | 'clinical' | 'legal') => void;
  isSidebarOpen: boolean;
  isPaneVisible: boolean;
  setView: (view: 'chat' | 'settings') => void;
  setContextText: (text: string) => void;
  onCloseSidebar: () => void;
}

/** Extract all text from a PDF ArrayBuffer using pdf.js */
async function extractPdfText(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    pages.push(strings.join(' '));
  }
  return pages.join('\n\n');
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  messages, 
  currentQuery, 
  setCurrentQuery, 
  onSend, 
  isLoading, 
  mode, 
  setMode,
  isSidebarOpen,
  isPaneVisible,
  setView,
  setContextText,
  onCloseSidebar
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  const applyFileContent = (text: string) => {
    setContextText(text);
    if (mode === 'normal') setMode('clinical');
    onCloseSidebar();
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFileName(file.name);
    const isPdf = file.name.toLowerCase().endsWith('.pdf');

    try {
      if (isPdf) {
        // Read PDF as ArrayBuffer and extract text
        const arrayBuffer = await file.arrayBuffer();
        const text = await extractPdfText(arrayBuffer);
        if (text.trim()) {
          applyFileContent(text);
        } else {
          setAttachedFileName(null);
          alert('Could not extract text from this PDF. It may be image-based (scanned).');
        }
      } else {
        // Plain text files
        const reader = new FileReader();
        reader.onload = (ev) => {
          const text = ev.target?.result as string;
          if (text) {
            applyFileContent(text);
          }
        };
        reader.onerror = () => {
          setAttachedFileName(null);
          console.error('Failed to read the file.');
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error('File processing error:', err);
      setAttachedFileName(null);
      alert('Failed to process the file. Please try a different format.');
    }
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  const handleRemoveFile = () => {
    setAttachedFileName(null);
    setContextText('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [mode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      onSend();
    }
  };

  const handleModeToggle = () => {
    if (mode === 'normal') setMode('clinical');
    else if (mode === 'clinical') setMode('legal');
    else setMode('normal');
  };

  return (
    <>
      {messages.length === 0 ? (
        // Hero Section
        <section className="text-center max-w-4xl w-full z-10 -mt-32 flex-1 flex flex-col items-center justify-center p-12">
          <div className="relative inline-block mb-12 mt-10">
            <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-150 animate-pulse"></div>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <span className="material-symbols-outlined text-7xl text-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>shield_with_heart</span>
              <div className="absolute inset-0 border-[0.5px] border-primary/30 rounded-full animate-[spin_25s_linear_infinite]"></div>
              <div className="absolute -inset-4 border-[0.5px] border-secondary/20 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tight mb-8 pb-4 bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent leading-[1.05]">
            Precision <br /> Intelligence
          </h1>
          <p className="text-lg md:text-xl font-body text-on-surface-variant/80 font-light mb-20 max-w-2xl leading-relaxed px-6">
            CreíbleAI scales <span className="text-[#00E5FF] font-medium">high-stakes expert reasoning</span> across clinical and legal domains with verified accuracy.
          </p>
        </section>
      ) : (
        // Messages Area
        <div className="flex-1 w-full max-w-5xl mx-auto overflow-y-auto custom-scrollbar p-8 space-y-12 pb-48">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg
                ${msg.role === 'user' 
                  ? 'bg-surface-container-high border border-white/10' 
                  : 'bg-gradient-to-br from-primary/30 to-secondary/10 border border-[#00E5FF]/20'
                }`}>
                {msg.role === 'user' 
                  ? <span className="material-symbols-outlined text-[20px] text-on-surface-variant">person</span> 
                  : <span className="material-symbols-outlined text-[20px] text-[#00E5FF]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
                }
              </div>

              <div className={`flex flex-col max-w-[80%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'user' && (
                  <div className="bg-[#1f1f25] text-on-surface px-6 py-4 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed border border-white/5 shadow-xl shadow-black/20">
                    {msg.content}
                  </div>
                )}

                {msg.role === 'assistant' && (
                  <div className="w-full space-y-4">
                    {msg.thinking && (
                      <div className="w-full bg-surface-container-low/40 rounded-2xl border-l-2 border-primary/40 p-5 shadow-inner transition-all duration-500 hover:bg-surface-container-low/60 relative group">
                        <div className="flex items-center gap-3 mb-3 text-primary/60">
                          <span className="material-symbols-outlined text-[16px] animate-pulse">psychology</span>
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-label">Chain of Thought</span>
                        </div>
                        <div className="text-[13px] text-on-surface-variant/70 font-body leading-relaxed max-w-3xl italic">
                          {msg.thinking}
                        </div>
                      </div>
                    )}

                    <div className="prose-creible prose-invert max-w-none text-[16px] leading-[1.8] text-white/90">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-primary/60 mb-3">
                          <span className="material-symbols-outlined text-[14px]">public</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest font-label">Verified Sources</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((source, idx) => (
                            <a 
                              key={idx} 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-[#131318]/50 hover:bg-[#131318] border border-white/10 rounded-lg text-[12px] text-white/60 hover:text-[#00E5FF] transition-all flex items-center gap-2 shadow-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] group/link"
                            >
                              <span className="material-symbols-outlined text-[14px] group-hover/link:animate-pulse">link</span>
                              <span className="truncate max-w-[250px]">{source.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.verificationStatus && mode !== 'normal' && (
                       <div className="mt-8 flex items-center gap-2 group cursor-default">
                          <div className={`flex items-center px-3 py-1.5 rounded-lg border backdrop-blur-md transition-all duration-300 ${
                              msg.verificationStatus === 'High Confidence' 
                                ? 'bg-primary/5 border-primary/20 text-[#00E5FF]' 
                                : 'bg-surface-container border-white/10 text-on-surface-variant'
                          }`}>
                            <span className="material-symbols-outlined text-[14px] mr-2">verified</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest font-label">{msg.verificationStatus}</span>
                          </div>
                          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                       </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-6 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <span className="material-symbols-outlined text-[20px] text-primary/40 animate-spin">cyclone</span>
              </div>
              <div className="flex flex-col space-y-4 w-full max-w-2xl">
                <div className="h-4 w-full bg-white/5 rounded-full"></div>
                <div className="h-4 w-[90%] bg-white/5 rounded-full"></div>
                <div className="h-4 w-[40%] bg-white/5 rounded-full"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Bottom Input Section - Refined Glassmorphism */}
      <div className={`fixed bottom-0 py-10 flex justify-center z-50 transition-all duration-500 ease-in-out pointer-events-none px-8 ${
        isSidebarOpen ? 'left-72 right-0' : (isPaneVisible ? 'left-0 right-[400px]' : 'left-0 right-0')
      }`}>
        <div className="max-w-5xl w-full flex flex-col items-center pointer-events-auto">
          <div className="relative w-full group">
            {/* Enhanced background glow on focus */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00E5FF]/20 to-secondary/20 rounded-[28px] blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
            
            <div className="relative flex flex-col glass-panel rounded-[24px] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-500 group-focus-within:border-[#00E5FF]/30 group-focus-within:shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_0_25px_rgba(0,229,255,0.03)] focus-within:ring-1 focus-within:ring-[#00E5FF]/10">
              
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-white/[0.03]">
                <div className="flex items-center gap-1.5">
                  <div onClick={handleModeToggle} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/5 cursor-pointer hover:border-[#00E5FF]/40 transition-all active:scale-95 group/mode shadow-inner">
                    <span className="material-symbols-outlined text-[14px] text-[#00E5FF]">{mode === 'clinical' ? 'stethoscope' : mode === 'legal' ? 'balance' : 'rocket_launch'}</span>
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{mode} Mode</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   {/* Hidden file input for Attach Data */}
                   <input
                     ref={fileInputRef}
                     type="file"
                     accept=".txt,.md,.csv,.json,.pdf,.doc,.docx"
                     className="hidden"
                     onChange={handleFileAttach}
                   />

                   {attachedFileName ? (
                     <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 animate-in fade-in zoom-in-95 duration-300">
                       <span className="material-symbols-outlined text-[14px] text-[#00E5FF]">description</span>
                       <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest max-w-[120px] truncate">{attachedFileName}</span>
                       <button
                         onClick={handleRemoveFile}
                         className="material-symbols-outlined text-[12px] text-white/40 hover:text-red-400 transition-colors ml-1"
                       >close</button>
                     </div>
                   ) : (
                     <button
                       onClick={() => fileInputRef.current?.click()}
                       className="text-[10px] font-bold text-white/30 hover:text-[#00E5FF] uppercase tracking-widest transition-colors flex items-center gap-1.5 group/attach"
                     >
                       <span className="material-symbols-outlined text-[16px] group-hover/attach:rotate-12 transition-transform">attach_file</span>
                       Attach Data
                     </button>
                   )}

                   <div className="w-[1px] h-3 bg-white/10"></div>
                   <button
                     onClick={() => setView('settings')}
                     className="material-symbols-outlined text-[18px] text-white/30 hover:text-white transition-all hover:rotate-45"
                   >settings</button>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex items-end gap-3 p-5 pt-3">
                <textarea 
                  ref={inputRef}
                  className="w-full bg-transparent border-none focus:ring-0 outline-none text-white placeholder:text-white/20 resize-none py-2 font-body text-[16px] leading-[1.6] custom-scrollbar max-h-[240px]"
                  placeholder={`Consult Creíble (${mode.charAt(0).toUpperCase() + mode.slice(1)} Engine)...`} 
                  rows={1}
                  value={currentQuery}
                  onChange={(e) => {
                    setCurrentQuery(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                
                <div className="flex items-center gap-3 pb-1">
                  <button className="w-11 h-11 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all active:scale-90">
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                  </button>
                  <button 
                    onClick={onSend}
                    disabled={!currentQuery.trim() || isLoading}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-90 disabled:opacity-10 disabled:grayscale disabled:scale-95 cursor-pointer ${
                      currentQuery.trim() 
                      ? 'bg-[#00E5FF] text-black shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] hover:scale-105' 
                      : 'bg-white/5 text-white/20'
                    }`}
                  >
                    <span className="material-symbols-outlined font-black text-[22px]">arrow_upward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-8 opacity-40 select-none">
             <div className="flex items-center gap-2">
               <span className="w-1 h-1 rounded-full bg-[#00E5FF]"></span>
               <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/80">Certified Intelligence</p>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-1 h-1 rounded-full bg-secondary"></span>
               <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/80">E2E Verification</p>
             </div>
          </div>
        </div>
      </div>

      {/* Side Decoration: Data Stream */}
      <div className="fixed right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-primary/20 to-transparent pointer-events-none hidden lg:block"></div>
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 opacity-20 pointer-events-none hidden lg:flex">
        <div className="w-1 h-32 bg-gradient-to-b from-transparent via-primary to-transparent rounded-full"></div>
        <div className="w-1 h-12 bg-gradient-to-b from-transparent via-secondary to-transparent rounded-full"></div>
        <div className="w-1 h-24 bg-gradient-to-b from-transparent via-tertiary to-transparent rounded-full"></div>
      </div>
    </>
  );
};

export default ChatPanel;
