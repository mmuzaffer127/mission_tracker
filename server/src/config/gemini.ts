import { GoogleGenAI } from '@google/genai';
import { config } from './env.js';

let aiClient: GoogleGenAI | null = null;

export function getGeminiAI(): GoogleGenAI | null {
  if (!aiClient && config.gemini.apiKey) {
    try {
      aiClient = new GoogleGenAI({ apiKey: config.gemini.apiKey });
    } catch (err) {
      console.warn('[Gemini AI] Initialization failed, will use fallback heuristics:', err);
    }
  }
  return aiClient;
}
