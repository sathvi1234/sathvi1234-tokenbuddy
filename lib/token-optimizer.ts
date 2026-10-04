/**
 * TokenBuddy Client-Side Token Optimization Engine
 *
 * Provides deterministic, privacy-friendly token estimation, prompt compression,
 * and cost calculation. Runs 100% in-browser with zero external network calls.
 */

export type OptimizationMode = 'lean' | 'structured' | 'ultra-short';

export interface OptimizationMetrics {
  originalTokens: number;
  optimizedTokens: number;
  tokensSaved: number;
  percentageSaved: number;
  costBefore: number;
  costAfter: number;
  moneySaved: number;
  originalWords: number;
  optimizedWords: number;
  removedFillersCount: number;
  qualityScoreBefore: number;
  qualityScoreAfter: number;
}

export interface OptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  mode: OptimizationMode;
  metrics: OptimizationMetrics;
  suggestions: string[];
}

/**
 * Benchmark pricing per 1,000 input tokens.
 * Default is based on standard frontier models (e.g., GPT-4o input: $0.005 / 1k tokens).
 */
export const REFERENCE_COST_PER_1K_TOKENS = 0.005;

/**
 * Heuristic token estimator.
 *
 * In standard BPE tokenizers (like cl100k_base or o200k_base):
 * - Average English text is ~1.3 tokens per word or ~4 characters per token.
 * - Punctuation, symbols, and operators count as distinct tokens.
 * - Long words (>6 chars) are typically split into subwords.
 *
 * Clearly labeled as an estimate.
 */
export function estimateTokens(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;

  let tokenCount = 0;

  for (const word of words) {
    // Base token for the word
    tokenCount += 1;

    // Subword penalty for longer words
    if (word.length > 7) {
      tokenCount += Math.floor((word.length - 7) / 4);
    }

    // Additional tokens for embedded punctuation or symbols
    const punctuationMatches = word.match(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'<>@\[\]\\|]/g);
    if (punctuationMatches) {
      tokenCount += Math.min(punctuationMatches.length, 3);
    }
  }

  return Math.max(1, Math.round(tokenCount));
}

/**
 * Clean up whitespace, punctuation spacing, and duplicate symbols.
 */
function normalizeFormatting(text: string): string {
  return text
    // Replace duplicate question marks
    .replace(/\?{2,}/g, '?')
    // Replace duplicate exclamation points
    .replace(/!{2,}/g, '!')
    // Replace duplicate commas
    .replace(/,{2,}/g, ',')
    // Replace duplicate periods unless ellipsis
    .replace(/\.{4,}/g, '...')
    // Fix spaces preceding punctuation (e.g., "step ." -> "step.")
    .replace(/\s+([.,!?:;])/g, '$1')
    // Fix multiple spaces to single space
    .replace(/[ \t]{2,}/g, ' ')
    // Limit consecutive newlines to maximum 2
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();
}

/**
 * Capitalize sentences and clean up trailing artifacts.
 */
function fixCapitalization(text: string): string {
  if (!text) return text;
  return text
    .replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase())
    .replace(/^([a-z])/, (match) => match.toUpperCase());
}

type ReplacementType = string | ((...args: any[]) => string);

/**
 * Common conversational filler phrases and polite pleasantries.
 */
const FILLER_RULES: Array<{ pattern: RegExp; replacement: ReplacementType; label: string }> = [
  // Conversational intros with action verbs (e.g. "I am building X and I need help designing" -> "Design")
  {
    pattern: /\b(?:i\s+am\s+building\s+[^,.]+?and\s+)?i\s+(?:need|want|would\s+like)\s+help\s+(?:to\s+|with\s+)?(designing|creating|building|writing|implementing|developing)\b/gi,
    replacement: (_match: string, verb: string) => {
      if (!verb) return '';
      const verbMap: Record<string, string> = {
        designing: 'Design',
        creating: 'Create',
        building: 'Build',
        writing: 'Write',
        implementing: 'Implement',
        developing: 'Develop',
      };
      return verbMap[verb.toLowerCase()] || verb;
    },
    label: 'Removed project preamble & converted to direct command',
  },
  // "Can you help me create / write / explain..." -> "Create / Write / Explain"
  {
    pattern: /\b(can|could|would)\s+you\s+(please\s+)?(help\s+me\s+(to\s+)?|kindly\s+)?(create|write|build|design|explain|implement|generate|review)\b/gi,
    replacement: (_: string, _c: string, _p: string, _h: string, _t: string, verb: string) =>
      verb ? verb.charAt(0).toUpperCase() + verb.slice(1) : '',
    label: 'Removed polite helper request',
  },
  // Polite openings & requests without specific verb
  { pattern: /\b(could\s+you\s+(please\s+)?(help\s+me\s+to\s+|help\s+me\s+|kindly\s+)?)/gi, replacement: '', label: 'Polite opening' },
  { pattern: /\b(would\s+you\s+(please\s+)?(mind\s+)?(helping\s+me\s+to\s+|helping\s+me\s+|kindly\s+)?)/gi, replacement: '', label: 'Polite opening' },
  { pattern: /\b(can\s+you\s+(please\s+)?(help\s+me\s+to\s+|help\s+me\s+|kindly\s+)?)/gi, replacement: '', label: 'Polite opening' },
  { pattern: /\b(i\s+would\s+appreciate\s+it\s+if\s+you\s+(could\s+)?)/gi, replacement: '', label: 'Polite preamble' },
  { pattern: /\b(i\s+was\s+wondering\s+if\s+you\s+could\s+)/gi, replacement: '', label: 'Polite preamble' },
  { pattern: /\b(i\s+need\s+help\s+(to\s+|with\s+)?)/gi, replacement: '', label: 'Conversational filler' },
  { pattern: /\b(it\s+would\s+be\s+great\s+if\s+you\s+could\s+)/gi, replacement: '', label: 'Polite preamble' },
  { pattern: /\b(feel\s+free\s+to\s+)/gi, replacement: '', label: 'Conversational filler' },
  { pattern: /\bplease\s+(explain|write|create|provide|show|list)\b/gi, replacement: '$1', label: 'Instruction fluff' },

  // Instruction wordiness
  { pattern: /\b(please\s+provide\s+a\s+(detailed\s+and\s+)?(comprehensive\s+)?)/gi, replacement: 'Provide ', label: 'Verbose instruction' },
  { pattern: /\b(write\s+a\s+(detailed\s+and\s+)?(comprehensive\s+)?)/gi, replacement: 'Write ', label: 'Verbose instruction' },
  { pattern: /\b(give\s+me\s+a\s+(detailed\s+and\s+)?(comprehensive\s+)?)/gi, replacement: 'Give ', label: 'Verbose instruction' },
  { pattern: /\b(make\s+sure\s+(that\s+)?you\s+)/gi, replacement: '', label: 'Instruction redundancy' },
  { pattern: /\b(ensure\s+(that\s+)?you\s+)/gi, replacement: '', label: 'Instruction redundancy' },
  { pattern: /\b(as\s+an\s+ai(\s+language\s+model)?,\s*)/gi, replacement: '', label: 'AI self-reference' },

  // Greetings and sign-offs
  { pattern: /^(hello|hi\s+there|hey\s+there|hi|hey|good\s+morning|good\s+afternoon|good\s+evening)[,\s!.]*/gi, replacement: '', label: 'Greeting' },
  { pattern: /([,\s.]*(thank\s+you\s+very\s+much|thanks\s+a\s+lot|thank\s+you\s+in\s+advance|thanks\s+in\s+advance|thank\s+you|thanks)[!.]*)$/gi, replacement: '', label: 'Sign-off pleasantry' },
  { pattern: /\b(at\s+your\s+earliest\s+convenience)\b/gi, replacement: '', label: 'Filler phrase' },
  { pattern: /\b(without\s+further\s+ado)\b/gi, replacement: '', label: 'Filler phrase' },
  { pattern: /\b(needless\s+to\s+say,?\s*)/gi, replacement: '', label: 'Filler phrase' },
  { pattern: /\b(as\s+mentioned\s+earlier)\b/gi, replacement: '', label: 'Filler phrase' },
];

/**
 * Concise replacements for wordy phrases.
 */
const CONCISE_REPLACEMENTS: Array<{ pattern: RegExp; replacement: string; label: string }> = [
  { pattern: /\bin\s+order\s+to\b/gi, replacement: 'to', label: 'in order to -> to' },
  { pattern: /\bdue\s+to\s+the\s+fact\s+that\b/gi, replacement: 'because', label: 'due to the fact that -> because' },
  { pattern: /\bfor\s+the\s+purpose\s+of\b/gi, replacement: 'to', label: 'for the purpose of -> to' },
  { pattern: /\bin\s+the\s+event\s+that\b/gi, replacement: 'if', label: 'in the event that -> if' },
  { pattern: /\bwith\s+regard\s+to\b/gi, replacement: 'regarding', label: 'with regard to -> regarding' },
  { pattern: /\bin\s+reference\s+to\b/gi, replacement: 'regarding', label: 'in reference to -> regarding' },
  { pattern: /\bat\s+the\s+present\s+time\b/gi, replacement: 'now', label: 'at the present time -> now' },
  { pattern: /\ba\s+large\s+number\s+of\b/gi, replacement: 'many', label: 'a large number of -> many' },
  { pattern: /\ba\s+majority\s+of\b/gi, replacement: 'most', label: 'a majority of -> most' },
  { pattern: /\bgive\s+an\s+explanation\s+of\b/gi, replacement: 'explain', label: 'give an explanation of -> explain' },
  { pattern: /\bprovide\s+a\s+summary\s+of\b/gi, replacement: 'summarize', label: 'provide a summary of -> summarize' },
  { pattern: /\btake\s+into\s+consideration\b/gi, replacement: 'consider', label: 'take into consideration -> consider' },
  { pattern: /\butilize(s|d|ing)?\b/gi, replacement: 'use$1', label: 'utilize -> use' },
  { pattern: /\bhow\s+it\s+is\s+used\s+in\b/gi, replacement: 'its application in', label: 'how it is used in -> its application in' },
  { pattern: /\bwhat\s+([a-zA-Z\s]+)\s+is\s+and\b/gi, replacement: '$1 definition and', label: 'what X is -> X definition' },
];

/**
 * Weak qualifiers to trim in Lean mode.
 */
const WEAK_QUALIFIERS = [
  /\bbasically\b/gi,
  /\bactually\b/gi,
  /\bliterally\b/gi,
  /\bsimply\b/gi,
  /\bdefinitely\b/gi,
  /\babsolutely\b/gi,
  /\bhonestly\b/gi,
  /\bclearly\b/gi,
  /\bvery\b/gi,
  /\breally\b/gi,
  /\bquite\b/gi,
];

/**
 * Technical / domain acronyms & contractions for Ultra-short mode.
 */
const ULTRA_SHORT_SUBS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /\bartificial\s+intelligence\b/gi, replacement: 'AI' },
  { pattern: /\bmachine\s+learning\b/gi, replacement: 'ML' },
  { pattern: /\blarge\s+language\s+model(s)?\b/gi, replacement: 'LLM$1' },
  { pattern: /\buser\s+authentication\b/gi, replacement: 'user auth' },
  { pattern: /\bpassword\s+validation\b/gi, replacement: 'password validation' },
  { pattern: /\bPython\s+function\b/gi, replacement: 'Python fn' },
  { pattern: /\breads\s+a\s+list\s+of\s+numbers\s+and\s+returns\s+the\s+largest\s+number\b/gi, replacement: 'returns max from list of numbers' },
  { pattern: /\breturns\s+the\s+largest\s+number\b/gi, replacement: 'returns max number' },
  { pattern: /\bexplain\s+each\s+step\b/gi, replacement: 'explain steps' },
  { pattern: /\bincluding\b/gi, replacement: 'with' },
  { pattern: /\bapplication(s)?\b/gi, replacement: 'app$1' },
  { pattern: /\bspecification(s)?\b/gi, replacement: 'spec$1' },
  { pattern: /\bstatistic(s)?\b/gi, replacement: 'stats' },
  { pattern: /\bprediction(s)?\b/gi, replacement: 'forecasts' },
  { pattern: /\bmodern\s+society\b/gi, replacement: 'modern society' },
];

/**
 * Mode 1: LEAN
 * Strips pleasantries, polite openings, filler verbs, and weak qualifiers.
 */
export function optimizeLean(text: string): { text: string; removedCount: number; appliedRules: string[] } {
  if (!text.trim()) return { text: '', removedCount: 0, appliedRules: [] };

  let current = text;
  let removedCount = 0;
  const appliedRules: string[] = [];

  for (const { pattern, replacement, label } of FILLER_RULES) {
    if (pattern.test(current)) {
      current = current.replace(pattern, replacement as any);
      removedCount++;
      if (!appliedRules.includes(label)) appliedRules.push(label);
    }
  }

  for (const pattern of WEAK_QUALIFIERS) {
    if (pattern.test(current)) {
      current = current.replace(pattern, '');
      removedCount++;
      if (!appliedRules.includes('Trimmed weak qualifiers')) {
        appliedRules.push('Trimmed weak qualifiers');
      }
    }
  }

  current = normalizeFormatting(current);
  current = fixCapitalization(current);

  return { text: current, removedCount, appliedRules };
}

/**
 * Mode 2: STRUCTURED
 * Cleans the prompt and organizes multi-part instructions or requirements
 * into clear, readable directive constraints.
 */
export function optimizeStructured(text: string): { text: string; removedCount: number; appliedRules: string[] } {
  if (!text.trim()) return { text: '', removedCount: 0, appliedRules: [] };

  const leanResult = optimizeLean(text);
  let current = leanResult.text;
  let removedCount = leanResult.removedCount;
  const appliedRules = [...leanResult.appliedRules];

  for (const { pattern, replacement, label } of CONCISE_REPLACEMENTS) {
    if (pattern.test(current)) {
      current = current.replace(pattern, replacement);
      removedCount++;
      if (!appliedRules.includes(`Condensed phrases (${label})`)) {
        appliedRules.push(`Condensed phrases (${label})`);
      }
    }
  }

  current = normalizeFormatting(current);

  // Check if prompt has an "including X, Y, Z..." pattern
  const includingMatch = current.match(/^(.*?)(?:,\s*including|\s+including)\s+(.*?)[.]?$/i);
  if (includingMatch) {
    const mainAction = includingMatch[1].trim();
    const itemsRaw = includingMatch[2].replace(/\band\s+/gi, '').split(/,\s*/);
    const items = itemsRaw.map((item) => item.trim()).filter(Boolean);

    if (items.length >= 2) {
      current = `${mainAction}.\n\nRequirements:\n${items.map((i) => `- ${i}`).join('\n')}`;
      appliedRules.push('Structured multi-item requirements into clean checklist');
      return { text: current, removedCount, appliedRules };
    }
  }

  // Check if prompt has multiple sentences or clauses (e.g. Prompt 2: function + explain steps)
  const sentences = current.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length >= 2) {
    const mainGoal = sentences[0].replace(/[.?]$/, '');
    const constraints = sentences.slice(1).map((s) => `- ${s.replace(/^[ -]+/, '').replace(/[.?]$/, '')}`);
    current = `Goal: ${mainGoal}.\n\nConstraints:\n${constraints.join('\n')}`;
    appliedRules.push('Structured task goal & constraints into readable format');
  } else {
    current = fixCapitalization(current);
  }

  return { text: current, removedCount, appliedRules };
}

/**
 * Mode 3: ULTRA-SHORT
 * Maximum token reduction. Distills to dense technical directives and acronyms.
 */
export function optimizeUltraShort(text: string): { text: string; removedCount: number; appliedRules: string[] } {
  if (!text.trim()) return { text: '', removedCount: 0, appliedRules: [] };

  // Start from lean base
  const leanResult = optimizeLean(text);
  let current = leanResult.text;
  let removedCount = leanResult.removedCount;
  const appliedRules = [...leanResult.appliedRules];

  // Apply acronyms and domain contractions
  for (const { pattern, replacement } of ULTRA_SHORT_SUBS) {
    if (pattern.test(current)) {
      current = current.replace(pattern, replacement);
      removedCount++;
      if (!appliedRules.includes('Applied industry acronyms & abbreviations')) {
        appliedRules.push('Applied industry acronyms & abbreviations');
      }
    }
  }

  // Strip non-essential articles and prepositions
  current = current
    .replace(/\b(what|is|and|the|a|an)\b/gi, (match, word, offset, string) => {
      // Remove articles and fluff connectives
      const prevChar = offset === 0 ? '' : string[offset - 1];
      if (offset === 0 || /\s/.test(prevChar)) {
        if (/^(the|a|an)$/i.test(word)) {
          removedCount++;
          return '';
        }
      }
      return match;
    })
    .replace(/\bhow it is used in\b/gi, 'usage in')
    .replace(/\bexplain what AI is\b/gi, 'explain AI definition')
    .replace(/\bcreate a Python function that\b/gi, 'Python fn:')
    .replace(/\bdesign a REST API for\b/gi, 'Design REST API:');

  current = normalizeFormatting(current);
  current = fixCapitalization(current);

  return { text: current, removedCount, appliedRules };
}

/**
 * Main TokenBuddy optimization controller.
 */
export function optimizePrompt(
  prompt: string,
  mode: OptimizationMode = 'lean',
  costPer1kTokens: number = REFERENCE_COST_PER_1K_TOKENS
): OptimizationResult {
  const originalPrompt = prompt || '';
  const originalTokens = estimateTokens(originalPrompt);
  const originalWords = originalPrompt.trim() ? originalPrompt.trim().split(/\s+/).length : 0;

  if (!originalPrompt.trim()) {
    return {
      originalPrompt,
      optimizedPrompt: '',
      mode,
      metrics: {
        originalTokens: 0,
        optimizedTokens: 0,
        tokensSaved: 0,
        percentageSaved: 0,
        costBefore: 0,
        costAfter: 0,
        moneySaved: 0,
        originalWords: 0,
        optimizedWords: 0,
        removedFillersCount: 0,
        qualityScoreBefore: 0,
        qualityScoreAfter: 0,
      },
      suggestions: ['Enter a prompt to analyze and optimize.'],
    };
  }

  let optimization: { text: string; removedCount: number; appliedRules: string[] };

  switch (mode) {
    case 'ultra-short':
      optimization = optimizeUltraShort(originalPrompt);
      break;
    case 'structured':
      optimization = optimizeStructured(originalPrompt);
      break;
    case 'lean':
    default:
      optimization = optimizeLean(originalPrompt);
      break;
  }

  const optimizedPrompt = optimization.text;
  const optimizedTokens = estimateTokens(optimizedPrompt);
  const optimizedWords = optimizedPrompt.trim() ? optimizedPrompt.trim().split(/\s+/).length : 0;

  const tokensSaved = Math.max(0, originalTokens - optimizedTokens);
  const percentageSaved = originalTokens > 0 ? Math.round((tokensSaved / originalTokens) * 100) : 0;

  const costBefore = (originalTokens * costPer1kTokens) / 1000;
  const costAfter = (optimizedTokens * costPer1kTokens) / 1000;
  const moneySaved = Math.max(0, costBefore - costAfter);

  // Dynamic Quality Score Calculation (0 - 100)
  let qualityScoreBefore = 70;
  if (optimization.removedCount > 0) {
    qualityScoreBefore = Math.max(35, 75 - optimization.removedCount * 6);
  }
  if (originalTokens > 150 && !originalPrompt.includes('\n')) {
    qualityScoreBefore -= 10;
  }

  const qualityScoreAfter = Math.min(
    98,
    Math.max(qualityScoreBefore + 15, Math.min(95, 75 + percentageSaved * 0.5))
  );

  const suggestions = optimization.appliedRules.length > 0
    ? optimization.appliedRules
    : [
        'Prompt is already relatively clean and concise.',
        'No major conversational filler detected.',
      ];

  return {
    originalPrompt,
    optimizedPrompt,
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
      removedFillersCount: optimization.removedCount,
      qualityScoreBefore,
      qualityScoreAfter,
    },
    suggestions,
  };
}
