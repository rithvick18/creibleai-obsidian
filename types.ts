
export interface AnalysisResult {
  rawResponse: string;
  thinking?: string;
  answer: string;
  verificationStatus?: 'High Confidence' | 'Low Confidence' | 'Insufficient Data' | 'Unknown' | 'General Knowledge';
  sources?: { title: string; url: string }[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  query: string;
  context: string;
  result: AnalysisResult;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  verificationStatus?: string;
  timestamp: number;
  sources?: { title: string; url: string }[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
  mode: 'normal' | 'clinical' | 'legal';
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}
