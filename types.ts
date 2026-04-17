
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

export interface ModelConfig {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
  candidateCount: number;
  presencePenalty: number;
  frequencyPenalty: number;
}

export interface ModelSettings {
  normal: ModelConfig;
  clinical: ModelConfig;
  legal: ModelConfig;
}

export const defaultModelConfig: ModelConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8192,
  candidateCount: 1,
  presencePenalty: 0,
  frequencyPenalty: 0,
};

export const defaultModelSettings: ModelSettings = {
  normal: { ...defaultModelConfig, temperature: 0.7 },
  clinical: { ...defaultModelConfig, temperature: 0.2, topP: 0.8 },
  legal: { ...defaultModelConfig, temperature: 0.2, topP: 0.8 },
};

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export interface AppSettings {
  provider: 'gemini' | 'mistral' | 'grok';
  geminiKey: string;
  mistralKey: string;
  grokKey: string;
  geminiModel: string;
  mistralModel: string;
}

