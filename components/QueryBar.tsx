import React, { KeyboardEvent, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface QueryBarProps {
  query: string;
  setQuery: (q: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const QueryBar: React.FC<QueryBarProps> = ({ query, setQuery, onAnalyze, isLoading, disabled }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && !disabled) {
      onAnalyze();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-obsidian-bg via-obsidian-bg to-transparent z-40 pointer-events-none">
      <div className="max-w-3xl mx-auto relative pointer-events-auto">
        
        {/* Input Container */}
        <div 
          className={`relative rounded-3xl transition-all duration-500 ease-out 
            ${isFocused ? 'shadow-glow translate-y-[-2px]' : 'shadow-glass'}
          `}
        >
          {/* Animated Gradient Border */}
          <div className={`absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 transition-opacity duration-500 ${isFocused ? 'opacity-50' : ''} blur-sm`}></div>
          
          <div className="relative flex items-center bg-[#18181b]/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            
            <div className="pl-5 pr-3 text-indigo-400">
               <Sparkles className={`w-5 h-5 transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-50'}`} />
            </div>

            <input
              type="text"
              className="flex-1 bg-transparent text-white text-base py-4 px-2 focus:outline-none placeholder-obsidian-muted/50 font-light"
              placeholder={disabled ? "Please provide context in the sidebar first..." : "Ask a high-stakes question to verify..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled || isLoading}
            />
            
            <div className="pr-2">
              <button
                onClick={onAnalyze}
                disabled={disabled || isLoading || !query.trim()}
                className={`p-2.5 rounded-2xl transition-all duration-300 flex items-center justify-center
                  ${disabled || isLoading || !query.trim()
                    ? 'text-obsidian-muted/30 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-indigo-50 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4 text-[10px] text-obsidian-muted/40 font-medium tracking-widest uppercase">
          CreíbleAI • Zero Hallucination Protocol
        </div>
      </div>
    </div>
  );
};

export default QueryBar;