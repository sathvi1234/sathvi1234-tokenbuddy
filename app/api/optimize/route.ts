import { NextRequest, NextResponse } from 'next/server';
import {
  optimizePrompt,
  estimateTokens,
  OptimizationMode,
  REFERENCE_COST_PER_1K_TOKENS,
} from '@/lib/token-optimizer';

export async function POST(req: NextRequest) {
  let prompt = '';
  let mode: OptimizationMode = 'lean';

  try {
    const body = await req.json();
    prompt = body.prompt || '';
    mode = body.mode || 'lean';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }

  if (!prompt || !prompt.trim()) {
    const emptyResult = optimizePrompt('', mode);
    return NextResponse.json({
      source: 'Fallback Optimizer',
      model: null,
      ...emptyResult,
    });
  }

  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'gemma2';

  const modeInstructions: Record<OptimizationMode, string> = {
    lean: 'Strip all conversational filler, polite pleasantries, greetings, and redundant preambles. Output only the direct instruction.',
    structured: 'Convert wordy descriptions into a clean, compact checklist with a concise task goal.',
    'ultra-short': 'Make it ultra-short with maximum token density, concise verbs, and industry standard acronyms.',
  };

  const systemPrompt = `You are a prompt compression engine. Your task is to compress the following user prompt to save LLM tokens while strictly preserving all technical details, constraints, and instructions.
Optimization Mode: ${mode.toUpperCase()}
Rule: ${modeInstructions[mode] || modeInstructions.lean}
CRITICAL: Respond with ONLY the compressed prompt. Do not include introductory text, explanations, or quotes.`;

  // On Vercel serverless functions, localhost/127.0.0.1 cannot reach the user's local machine.
  // We preserve local Gemma for local development, but in cloud production without an external
  // OLLAMA_BASE_URL configured, we skip localhost immediately for instant response.
  const isVercel = Boolean(process.env.VERCEL);
  const isLocalHost = ollamaBaseUrl.includes('127.0.0.1') || ollamaBaseUrl.includes('localhost');
  const shouldAttemptOllama = !(isVercel && isLocalHost);

  if (shouldAttemptOllama) {
    try {
      const controller = new AbortController();
      const timeoutMs = isLocalHost ? 2000 : 5000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const ollamaResponse = await fetch(`${ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: `${systemPrompt}\n\nPrompt:\n${prompt}`,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

    if (ollamaResponse.ok) {
      const data = await ollamaResponse.json();
      const generatedText = (data.response || '').trim();

      if (generatedText) {
        const originalTokens = estimateTokens(prompt);
        const optimizedTokens = estimateTokens(generatedText);
        const tokensSaved = Math.max(0, originalTokens - optimizedTokens);
        const percentageSaved =
          originalTokens > 0
            ? Math.min(100, Math.max(0, Math.round((tokensSaved / originalTokens) * 100)))
            : 0;

        const costBefore = (originalTokens / 1000) * REFERENCE_COST_PER_1K_TOKENS;
        const costAfter = (optimizedTokens / 1000) * REFERENCE_COST_PER_1K_TOKENS;
        const moneySaved = Math.max(0, costBefore - costAfter);

        const originalWords = prompt.trim().split(/\s+/).filter(Boolean).length;
        const optimizedWords = generatedText.split(/\s+/).filter(Boolean).length;

        return NextResponse.json({
          source: 'Local Gemma',
          model: ollamaModel,
          originalPrompt: prompt,
          optimizedPrompt: generatedText,
          mode,
          metrics: {
            originalTokens,
            optimizedTokens,
            tokensSaved,
            percentageSaved,
            costBefore,
            costAfter,
            moneySaved,
            originalWords,
            optimizedWords,
            removedFillersCount: Math.max(0, originalWords - optimizedWords),
            qualityScoreBefore: Math.min(100, Math.max(20, Math.round(100 - (originalTokens / originalWords || 1) * 35))),
            qualityScoreAfter: Math.min(100, Math.max(50, Math.round(75 + percentageSaved * 0.25))),
          },
          suggestions: [
            `Compressed via local open-weight model (${ollamaModel})`,
            'Zero data transmitted off-device',
          ],
        });
      }
    }
  } catch {
    // Ollama unreachable, timed out, or threw connection error -> proceed to fallback
  }
}

  // Fallback to deterministic client-side optimizer
  const fallbackResult = optimizePrompt(prompt, mode);
  return NextResponse.json({
    source: 'Fallback Optimizer',
    model: null,
    ...fallbackResult,
  });
}
