import { RawTransaction, GeminiIntelligenceMap } from './types';

export const RAW_DATA: RawTransaction[] = [
  { id: 1, date: '26 NOV', rawDescription: 'PG * UBER TRIP S.PAULO BR', value: -24.90, type: 'debit' },
  { id: 2, date: '26 NOV', rawDescription: 'MCDONALDS LOJA 332', value: -45.50, type: 'debit' },
  { id: 3, date: '25 NOV', rawDescription: 'NETFLIX.COM ASSINATURA', value: -55.90, type: 'debit' },
  { id: 4, date: '25 NOV', rawDescription: 'DROGASIL SAO PAULO', value: -89.00, type: 'debit' },
  { id: 5, date: '24 NOV', rawDescription: 'PIX RECEBIDO - MARIA SILVA', value: 150.00, type: 'credit' },
];

export const GEMINI_INTELLIGENCE: GeminiIntelligenceMap = {
  1: { cleanName: 'Uber', category: 'Transporte', emoji: '🚗', sentiment: 'Essencial' },
  2: { cleanName: 'McDonald\'s', category: 'Alimentação', emoji: '🍔', sentiment: 'Supérfluo' },
  3: { cleanName: 'Netflix', category: 'Lazer', emoji: '🎬', sentiment: 'Recorrente' },
  4: { cleanName: 'Drogasil', category: 'Saúde', emoji: '💊', sentiment: 'Essencial' },
  5: { cleanName: 'Transferência (Maria)', category: 'Renda', emoji: '💰', sentiment: 'Positivo' },
};