import { optimizePrompt, estimateTokens } from './lib/token-optimizer.ts';

const prompts = [
  {
    id: 1,
    title: 'PROMPT 1',
    text: 'Could you please explain what artificial intelligence is and how it is used in modern society? Thank you in advance.',
  },
  {
    id: 2,
    title: 'PROMPT 2',
    text: 'Can you help me create a Python function that reads a list of numbers and returns the largest number? Please explain each step clearly.',
  },
  {
    id: 3,
    title: 'PROMPT 3',
    text: 'I am building a web application and I need help designing a REST API for user authentication, including registration, login, password validation, JWT tokens, and error handling.',
  },
];

console.log('===============================================================');
console.log('       TOKENBUDDY DETERMINISTIC TOKEN OPTIMIZER TEST           ');
console.log('===============================================================\n');

for (const p of prompts) {
  console.log(`---------------------------------------------------------------`);
  console.log(`[${p.title}]`);
  console.log(`INPUT: "${p.text}"`);
  const origTokens = estimateTokens(p.text);
  console.log(`Original Tokens (Est.): ${origTokens}\n`);

  for (const mode of ['lean', 'structured', 'ultra-short']) {
    const res = optimizePrompt(p.text, mode);
    console.log(`  MODE: ${mode.toUpperCase()}`);
    console.log(`  Optimized: "${res.optimizedPrompt}"`);
    console.log(`  Est. Tokens: ${res.metrics.originalTokens} -> ${res.metrics.optimizedTokens} (${res.metrics.percentageSaved}% saved)`);
    console.log(`  Est. Cost: $${res.metrics.costBefore.toFixed(5)} -> $${res.metrics.costAfter.toFixed(5)}`);
    console.log(`  Money Saved (Est.): $${res.metrics.moneySaved.toFixed(5)}`);
    console.log(`  Quality Score: ${res.metrics.qualityScoreBefore} -> ${res.metrics.qualityScoreAfter}`);
    console.log(`  Rules Applied: ${res.suggestions.join('; ')}`);
    console.log('');
  }
}
console.log('===============================================================');
console.log('All 3 prompts evaluated across Lean, Structured & Ultra-short.');
