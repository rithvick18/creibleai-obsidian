import React from 'react';
import { FileText, MoreHorizontal, ShieldCheck, Lock, UploadCloud } from 'lucide-react';
import { MEDICAL_CONTEXT, LEGAL_CONTEXT } from '../constants';

interface ContextPanelProps {
  contextText: string;
  setContextText: (text: string) => void;
}

const ContextPanel: React.FC<ContextPanelProps> = ({ contextText, setContextText }) => {
  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] border-l border-[#1F1F1F] relative overflow-hidden">
      
      {/* Document Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#1F1F1F] bg-[#0A0A0A]/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1F1F1F] text-[#A1A1AA]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-[#EDEDED]">Active Document:</h2>
            <p className="text-xs text-[#A1A1AA]">Master_Services_Agreement.pdf</p>
          </div>
        </div>
        <button className="p-2 text-[#A1A1AA] hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Selectors (Optional, kept for functionality) */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-[#1F1F1F] bg-[#050505]">
        <button 
           onClick={() => setContextText(MEDICAL_CONTEXT)}
           className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded bg-[#1F1F1F] text-[#A1A1AA] hover:text-white border border-transparent hover:border-[#333] transition-all"
        >
          Load Medical
        </button>
        <button 
           onClick={() => setContextText(LEGAL_CONTEXT)}
           className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded bg-[#1F1F1F] text-[#A1A1AA] hover:text-white border border-transparent hover:border-[#333] transition-all"
        >
          Load Legal
        </button>
      </div>

      {/* Document Content */}
      <div className="flex-1 relative overflow-hidden group">
        <textarea
          className="w-full h-full bg-[#050505] text-[#D4D4D8] text-sm font-mono leading-relaxed p-8 focus:outline-none resize-none custom-scrollbar selection:bg-indigo-500/30"
          value={contextText}
          onChange={(e) => setContextText(e.target.value)}
          spellCheck={false}
          placeholder="Paste high-stakes document content here..."
        />
        
        {/* Context Lock Overlay Notification */}
        <div className="absolute bottom-8 left-6 right-6 z-20">
          <div className="bg-[#18181B]/90 backdrop-blur-xl border border-[#27272A] rounded-xl p-4 flex items-start gap-4 shadow-2xl shadow-black/50">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
               <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
               <div className="flex items-center justify-between mb-1">
                 <h3 className="text-sm font-semibold text-white">Context Lock Active</h3>
                 <button className="text-[#71717A] hover:text-white">
                   <Lock className="w-3 h-3" />
                 </button>
               </div>
               <p className="text-xs text-[#A1A1AA] leading-relaxed">
                 Creíble Lock active. AI is constrained strictly to information present in this document to prevent hallucination.
               </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ContextPanel;