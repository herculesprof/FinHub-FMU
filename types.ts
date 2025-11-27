export interface RawTransaction {
  id: number;
  date: string;
  rawDescription: string;
  value: number;
  type: 'debit' | 'credit';
}

export interface IntelligenceData {
  cleanName: string;
  category: string;
  emoji: string;
  sentiment: string;
}

export interface EnrichedTransaction extends RawTransaction, IntelligenceData {}

export interface GeminiIntelligenceMap {
  [key: number]: IntelligenceData;
}