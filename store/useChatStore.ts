import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, ChatSession } from '../types';
import { analyzeQuery } from '../services/geminiService';
import { DEFAULT_CONTEXT } from '../constants';

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  messages: ChatMessage[];
  mode: 'normal' | 'clinical' | 'legal';
  contextText: string;
  isLoading: boolean;
  
  // Actions
  setMode: (mode: 'normal' | 'clinical' | 'legal') => void;
  setContextText: (text: string) => void;
  setCurrentSessionId: (id: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  
  newChat: () => void;
  selectSession: (id: string) => void;
  deleteSession: (id: string) => void;
  sendMessage: (query: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      messages: [],
      mode: 'normal',
      contextText: DEFAULT_CONTEXT,
      isLoading: false,

      setMode: (mode) => set({ mode }),
      setContextText: (contextText) => set({ contextText }),
      setCurrentSessionId: (currentSessionId) => set({ currentSessionId }),
      setMessages: (messages) => set({ messages }),

      newChat: () => set({ 
        messages: [], 
        currentSessionId: null 
      }),

      selectSession: (id) => {
        const session = get().sessions.find(s => s.id === id);
        if (session) {
          set({ 
            currentSessionId: id, 
            messages: session.messages,
            mode: session.mode 
          });
        }
      },

      deleteSession: (id) => {
        const { sessions, currentSessionId } = get();
        const newSessions = sessions.filter(s => s.id !== id);
        set({ sessions: newSessions });
        if (currentSessionId === id) {
          get().newChat();
        }
      },

      sendMessage: async (query) => {
        if (!query.trim() || get().isLoading) return;

        const { messages, currentSessionId, mode, contextText, sessions } = get();
        set({ isLoading: true });

        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: query,
          timestamp: Date.now()
        };

        const updatedMessages = [...messages, userMsg];
        set({ messages: updatedMessages });

        let sessionId = currentSessionId;
        let currentSessionList = [...sessions];

        if (!sessionId) {
          sessionId = Date.now().toString();
          const newSession: ChatSession = {
            id: sessionId,
            title: query.slice(0, 30) + (query.length > 30 ? '...' : ''),
            messages: updatedMessages,
            timestamp: Date.now(),
            mode: mode
          };
          currentSessionList = [newSession, ...currentSessionList];
          set({ currentSessionId: sessionId });
        } else {
          currentSessionList = currentSessionList.map(s => 
            s.id === sessionId ? { ...s, messages: updatedMessages, timestamp: Date.now() } : s
          );
          // Move to top
          const current = currentSessionList.find(s => s.id === sessionId);
          if (current) {
            currentSessionList = [current, ...currentSessionList.filter(s => s.id !== sessionId)];
          }
        }
        set({ sessions: currentSessionList });

        try {
          const result = await analyzeQuery(contextText, query, mode);
          
          const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: result.answer,
            thinking: result.thinking,
            verificationStatus: result.verificationStatus,
            timestamp: Date.now()
          };

          const finalMessages = [...updatedMessages, aiMsg];
          set({ messages: finalMessages });

          set((state) => ({
            sessions: state.sessions.map(s => 
              s.id === sessionId ? { ...s, messages: finalMessages } : s
            )
          }));
        } catch (err: any) {
          const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Error: ${err.message || "An unexpected error occurred."}`,
            timestamp: Date.now()
          };
          const errorMessages = [...updatedMessages, errorMsg];
          set({ messages: errorMessages });
          
          set((state) => ({
            sessions: state.sessions.map(s => 
              s.id === sessionId ? { ...s, messages: errorMessages } : s
            )
          }));
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'creible-chat-storage',
      partialize: (state) => ({ sessions: state.sessions }), // Only persist sessions
    }
  )
);
