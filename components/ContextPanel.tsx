import React, { useRef } from 'react';
import { FileText, MoreHorizontal, ShieldCheck, Lock, UploadCloud, FileUp, Trash2 } from 'lucide-react';
import { MEDICAL_CONTEXT, LEGAL_CONTEXT } from '../constants.js';

interface ContextPanelProps {
  contextText: string;
  setContextText: (text: string) => void;
}

const ContextPanel: React.FC<ContextPanelProps> = ({ contextText, setContextText }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let text = '';
      
      if (file.type === 'text/plain' || file.name.endsWith('.md')) {
        text = await file.text();
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // For PDF files, we'll need to use a PDF library
        // For now, show a placeholder message
        text = `PDF file "${file.name}" has been loaded.\n\nNote: PDF parsing requires additional library support. The file content will be processed when PDF parsing is implemented.\n\nFile size: ${(file.size / 1024).toFixed(2)} KB\nLast modified: ${new Date(file.lastModified).toLocaleString()}`;
      } else if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        // For Word documents
        text = `Word document "${file.name}" has been loaded.\n\nNote: DOC/DOCX parsing requires additional library support. The file content will be processed when document parsing is implemented.\n\nFile size: ${(file.size / 1024).toFixed(2)} KB\nLast modified: ${new Date(file.lastModified).toLocaleString()}`;
      } else {
        // Try to read as text for other file types
        text = await file.text();
      }
      
      setContextText(text);
      
      // Update the document name display
      const docNameElement = document.querySelector('.document-name');
      if (docNameElement) {
        docNameElement.textContent = file.name;
      }
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try again.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const clearContext = () => {
    setContextText('');
    const docNameElement = document.querySelector('.document-name');
    if (docNameElement) {
      docNameElement.textContent = 'No document loaded';
    }
  };
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
            <p className="text-xs text-[#A1A1AA] document-name">No document loaded</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleImportClick}
            className="p-2 text-[#A1A1AA] hover:text-white transition-colors"
            title="Import document"
          >
            <FileUp className="w-5 h-5" />
          </button>
          <button 
            onClick={clearContext}
            className="p-2 text-[#A1A1AA] hover:text-white transition-colors"
            title="Clear context"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-[#A1A1AA] hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
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

    {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ContextPanel;