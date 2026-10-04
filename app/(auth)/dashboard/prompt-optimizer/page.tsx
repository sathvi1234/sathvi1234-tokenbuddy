'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles, Copy, Check, ArrowRight, DollarSign, Layers, ShieldCheck, RefreshCw } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import {
  optimizePrompt,
  estimateTokens,
  OptimizationMode,
  OptimizationResult,
  REFERENCE_COST_PER_1K_TOKENS,
} from '@/lib/token-optimizer';

const SAMPLE_PROMPTS = [
  {
    label: 'Coding Task',
    text: 'Could you please help me to write a comprehensive Python script in order to parse JSON files and extract user statistics? Please make sure to include error handling and step-by-step comments. Thank you very much!',
  },
  {
    label: 'Blog Post',
    text: 'I would appreciate it if you could write a detailed and comprehensive blog post about artificial intelligence and its impact on modern society, including a large number of examples, statistics, and future predictions.',
  },
  {
    label: 'Code Review',
    text: 'Can you please review the following code at your earliest convenience? Needless to say, ensure that you look for performance bottlenecks and basically suggest any improvements that you utilize in production. Thanks in advance!!',
  },
];

export default function PromptOptimizerPage() {
  const [promptInput, setPromptInput] = useState(SAMPLE_PROMPTS[1].text);
  const [activeMode, setActiveMode] = useState<OptimizationMode>('lean');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copiedMode, setCopiedMode] = useState<string | null>(null);
  const [engineSource, setEngineSource] = useState<'Local Gemma' | 'Fallback Optimizer'>('Fallback Optimizer');
  const [aiOptimizedResult, setAiOptimizedResult] = useState<OptimizationResult | null>(null);
  const { addNotification } = useUIStore();

  // Compute results deterministically for all 3 modes so the user can easily inspect or switch
  const leanResult = useMemo(() => optimizePrompt(promptInput, 'lean'), [promptInput]);
  const structuredResult = useMemo(() => optimizePrompt(promptInput, 'structured'), [promptInput]);
  const ultraShortResult = useMemo(() => optimizePrompt(promptInput, 'ultra-short'), [promptInput]);

  const deterministicCurrentResult: OptimizationResult = useMemo(() => {
    switch (activeMode) {
      case 'structured':
        return structuredResult;
      case 'ultra-short':
        return ultraShortResult;
      case 'lean':
      default:
        return leanResult;
    }
  }, [activeMode, leanResult, structuredResult, ultraShortResult]);

  const currentResult: OptimizationResult = useMemo(() => {
    if (aiOptimizedResult && aiOptimizedResult.mode === activeMode && aiOptimizedResult.originalPrompt === promptInput) {
      return aiOptimizedResult;
    }
    return deterministicCurrentResult;
  }, [aiOptimizedResult, activeMode, promptInput, deterministicCurrentResult]);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput, mode: activeMode }),
      });

      if (res.ok) {
        const data = await res.json();
        const source = data.source === 'Local Gemma' ? 'Local Gemma' : 'Fallback Optimizer';
        setEngineSource(source);
        setAiOptimizedResult({
          originalPrompt: data.originalPrompt,
          optimizedPrompt: data.optimizedPrompt,
          mode: data.mode,
          metrics: data.metrics,
          suggestions: data.suggestions,
        });
        addNotification({
          id: `notification_${Date.now()}`,
          type: 'success',
          message: `Optimized via ${source} (${data.metrics.percentageSaved}% tokens saved)`,
        });
      } else {
        throw new Error('API request failed');
      }
    } catch {
      setEngineSource('Fallback Optimizer');
      const fallback = optimizePrompt(promptInput, activeMode);
      setAiOptimizedResult(fallback);
      addNotification({
        id: `notification_${Date.now()}`,
        type: 'info',
        message: `Optimized via Fallback Optimizer (${fallback.metrics.percentageSaved}% saved)`,
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = (text: string, modeKey: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedMode(modeKey);
    setTimeout(() => setCopiedMode(null), 2000);
    addNotification({
      id: `notification_${Date.now()}`,
      type: 'success',
      message: 'Optimized prompt copied to clipboard',
    });
  };

  const loadSample = (sampleText: string) => {
    setPromptInput(sampleText);
    setAiOptimizedResult(null);
    setEngineSource('Fallback Optimizer');
  };

  const { metrics, suggestions } = currentResult;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Prompt Optimizer</h1>
            <Badge
              variant={engineSource === 'Local Gemma' ? 'default' : 'outline'}
              className={`text-xs font-medium ${
                engineSource === 'Local Gemma'
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-blue-500/30 text-blue-600 dark:text-blue-400'
              }`}
            >
              Engine: {engineSource}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Heuristic token estimation &amp; deterministic compression. Removes conversational fluff, saves context, and keeps your data 100% private.
          </p>
        </div>

        {/* Quick sample loader */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Quick Presets:</span>
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => loadSample(sample.text)}
              className="text-xs h-7 px-2.5"
            >
              {sample.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Original Prompt Input (7 cols) */}
        <Card className="glass lg:col-span-7 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Original Prompt</CardTitle>
                <CardDescription>Enter or paste your raw prompt below</CardDescription>
              </div>
              <Badge variant="secondary" className="font-mono text-xs">
                Est. {metrics.originalTokens} tokens
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-2 flex-1">
              <Textarea
                value={promptInput}
                onChange={(e) => {
                  setPromptInput(e.target.value);
                  setAiOptimizedResult(null);
                  setEngineSource('Fallback Optimizer');
                }}
                placeholder="Paste your prompt here (e.g. Could you please write a comprehensive script to...)..."
                className="min-h-40 font-mono text-sm leading-relaxed"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span>Words: <strong className="text-foreground">{metrics.originalWords}</strong></span>
                  <span>Estimated Tokens*: <strong className="text-foreground">{metrics.originalTokens}</strong></span>
                </div>
                <div>
                  <span>Est. Baseline Cost: <strong className="text-foreground">${metrics.costBefore.toFixed(5)}</strong></span>
                </div>
              </div>
            </div>

            {/* Mode Selector and Action Button */}
            <div className="space-y-3 pt-2 border-t border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Optimization Mode</Label>
                  <Tabs value={activeMode} onValueChange={(val) => setActiveMode(val as OptimizationMode)}>
                    <TabsList className="grid grid-cols-3 w-[280px] h-8">
                      <TabsTrigger value="lean" className="text-xs">Lean</TabsTrigger>
                      <TabsTrigger value="structured" className="text-xs">Structured</TabsTrigger>
                      <TabsTrigger value="ultra-short" className="text-xs">Ultra-short</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button
                  onClick={handleOptimize}
                  disabled={isOptimizing || !promptInput.trim()}
                  className="gap-2 self-end sm:self-auto"
                >
                  <Sparkles className="size-4" />
                  {isOptimizing ? 'Compressing...' : 'Optimize Now'}
                </Button>
              </div>

              <p className="text-[11px] text-muted-foreground italic">
                *Token counts are heuristic approximations based on standard LLM subword patterns (~1.3 tokens/word + punctuation weights).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Live Analysis & Score (5 cols) */}
        <Card className="glass lg:col-span-5 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Prompt Efficiency Analysis</CardTitle>
            <CardDescription>Real-time heuristic evaluation</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 flex-1 flex flex-col justify-between">
            {/* Quality Score Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Efficiency Score</span>
                <span className="font-bold font-mono">
                  {metrics.qualityScoreBefore}/100 &rarr; <span className="text-emerald-600 dark:text-emerald-400">{metrics.qualityScoreAfter}/100</span>
                </span>
              </div>
              <Progress value={metrics.qualityScoreAfter} className="h-2" />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Baseline: {metrics.qualityScoreBefore}</span>
                <span>Optimized: +{Math.max(0, metrics.qualityScoreAfter - metrics.qualityScoreBefore)} pts</span>
              </div>
            </div>

            {/* Savings Highlights */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border/50 bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">Tokens Saved</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    -{metrics.percentageSaved}%
                  </span>
                  <span className="text-xs text-muted-foreground">({metrics.tokensSaved} tokens)</span>
                </div>
              </div>

              <div className="rounded-lg border border-border/50 bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">Cost Savings / 1k Runs</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                    ${(metrics.moneySaved * 1000).toFixed(3)}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Transformation Rules Applied */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Applied Optimizations
              </Label>
              <ul className="space-y-1.5 text-xs text-muted-foreground max-h-36 overflow-y-auto pr-1">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md bg-muted/40 p-2.5 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
              <span>
                {engineSource === 'Local Gemma'
                  ? 'Processed locally with open-weight Gemma via Ollama. Zero external server calls.'
                  : 'Processed locally in browser memory. Zero external server calls.'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Results Section */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Optimization Results</CardTitle>
                <Badge
                  variant={engineSource === 'Local Gemma' ? 'default' : 'secondary'}
                  className={`text-[11px] font-mono ${
                    engineSource === 'Local Gemma'
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : ''
                  }`}
                >
                  {engineSource}
                </Badge>
              </div>
              <CardDescription>
                Compare output across Lean, Structured, and Ultra-short modes ({engineSource})
              </CardDescription>
            </div>

            {/* Mode Tabs for Results */}
            <Tabs value={activeMode} onValueChange={(val) => setActiveMode(val as OptimizationMode)}>
              <TabsList className="h-8">
                <TabsTrigger value="lean" className="text-xs gap-1.5">
                  Lean
                  <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                    -{leanResult.metrics.percentageSaved}%
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="structured" className="text-xs gap-1.5">
                  Structured
                  <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-blue-500/30 text-blue-600 dark:text-blue-400">
                    -{structuredResult.metrics.percentageSaved}%
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="ultra-short" className="text-xs gap-1.5">
                  Ultra-short
                  <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-purple-500/30 text-purple-600 dark:text-purple-400">
                    -{ultraShortResult.metrics.percentageSaved}%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Active Mode Output Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold capitalize">{activeMode} Result</Label>
                <span className="text-xs text-muted-foreground">
                  {activeMode === 'lean' && '(Pares polite filler, greetings, and weak qualifiers)'}
                  {activeMode === 'structured' && '(Condenses verbose idioms & groups multi-step constraints)'}
                  {activeMode === 'ultra-short' && '(Maximum token density & technical acronym contractions)'}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(currentResult.optimizedPrompt, activeMode)}
                className="gap-1.5 h-8 text-xs"
                disabled={!currentResult.optimizedPrompt}
              >
                {copiedMode === activeMode ? (
                  <>
                    <Check className="size-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </Button>
            </div>

            <div className="relative rounded-lg border border-border/60 bg-muted/40 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap min-h-24">
              {currentResult.optimizedPrompt || (
                <span className="text-muted-foreground italic font-sans text-xs">
                  Enter a prompt above to see the optimized result.
                </span>
              )}
            </div>
          </div>

          {/* Detailed Metric Strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 border-t border-border/50 pt-4">
            <div className="rounded-lg bg-background/50 border border-border/40 p-2.5 text-center">
              <p className="text-[11px] text-muted-foreground">Est. Tokens Before</p>
              <p className="font-mono text-sm font-bold mt-0.5">{metrics.originalTokens}</p>
            </div>

            <div className="rounded-lg bg-background/50 border border-border/40 p-2.5 text-center">
              <p className="text-[11px] text-muted-foreground">Est. Tokens After</p>
              <p className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {metrics.optimizedTokens}
              </p>
            </div>

            <div className="rounded-lg bg-background/50 border border-border/40 p-2.5 text-center">
              <p className="text-[11px] text-muted-foreground">% Saved</p>
              <p className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {metrics.percentageSaved}%
              </p>
            </div>

            <div className="rounded-lg bg-background/50 border border-border/40 p-2.5 text-center">
              <p className="text-[11px] text-muted-foreground">Cost Before (Est.)</p>
              <p className="font-mono text-xs font-semibold mt-0.5">${metrics.costBefore.toFixed(5)}</p>
            </div>

            <div className="rounded-lg bg-background/50 border border-border/40 p-2.5 text-center">
              <p className="text-[11px] text-muted-foreground">Cost After (Est.)</p>
              <p className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                ${metrics.costAfter.toFixed(5)}
              </p>
            </div>

            <div className="rounded-lg bg-background/50 border border-border/40 p-2.5 text-center">
              <p className="text-[11px] text-muted-foreground">Money Saved (Est.)</p>
              <p className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                ${metrics.moneySaved.toFixed(5)}
              </p>
            </div>
          </div>

          {/* Quick Side-by-Side Comparison of All 3 Modes */}
          <div className="space-y-3 border-t border-border/50 pt-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              All Modes at a Glance
            </h4>
            <div className="grid gap-3 md:grid-cols-3">
              {/* Lean Preview */}
              <div
                onClick={() => setActiveMode('lean')}
                className={`cursor-pointer rounded-lg border p-3.5 transition-all text-xs space-y-2 ${
                  activeMode === 'lean'
                    ? 'border-emerald-500/70 bg-emerald-500/5 shadow-sm'
                    : 'border-border/50 bg-background/40 hover:border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">1. Lean Mode</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    ~{leanResult.metrics.optimizedTokens} tok (-{leanResult.metrics.percentageSaved}%)
                  </Badge>
                </div>
                <p className="text-muted-foreground line-clamp-3 font-mono leading-relaxed">
                  {leanResult.optimizedPrompt || '—'}
                </p>
              </div>

              {/* Structured Preview */}
              <div
                onClick={() => setActiveMode('structured')}
                className={`cursor-pointer rounded-lg border p-3.5 transition-all text-xs space-y-2 ${
                  activeMode === 'structured'
                    ? 'border-blue-500/70 bg-blue-500/5 shadow-sm'
                    : 'border-border/50 bg-background/40 hover:border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">2. Structured Mode</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    ~{structuredResult.metrics.optimizedTokens} tok (-{structuredResult.metrics.percentageSaved}%)
                  </Badge>
                </div>
                <p className="text-muted-foreground line-clamp-3 font-mono leading-relaxed">
                  {structuredResult.optimizedPrompt || '—'}
                </p>
              </div>

              {/* Ultra-short Preview */}
              <div
                onClick={() => setActiveMode('ultra-short')}
                className={`cursor-pointer rounded-lg border p-3.5 transition-all text-xs space-y-2 ${
                  activeMode === 'ultra-short'
                    ? 'border-purple-500/70 bg-purple-500/5 shadow-sm'
                    : 'border-border/50 bg-background/40 hover:border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">3. Ultra-short Mode</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    ~{ultraShortResult.metrics.optimizedTokens} tok (-{ultraShortResult.metrics.percentageSaved}%)
                  </Badge>
                </div>
                <p className="text-muted-foreground line-clamp-3 font-mono leading-relaxed">
                  {ultraShortResult.optimizedPrompt || '—'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
