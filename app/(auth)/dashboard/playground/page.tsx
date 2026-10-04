'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Play, Download, RotateCcw } from 'lucide-react';
import { MODELS } from '@/lib/constants';
import { useUIStore } from '@/lib/store/ui-store';
import { mockResponses } from '@/lib/mock-data';

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState('What are the top 5 AI trends in 2024?');
  const [model, setModel] = useState<string>('gpt-4o');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useUIStore();

  const selectedModel = MODELS[model];
  const mockResponse = mockResponses[0];
  const estimatedCost = (prompt.split(' ').length * selectedModel.costPer1kInput) / 1000;

  const handleRun = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    addNotification({
      id: `notification_${Date.now()}`,
      type: 'success',
      message: 'Prompt executed successfully',
    });
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(mockResponse.content);
    addNotification({
      id: `notification_${Date.now()}`,
      type: 'success',
      message: 'Response copied to clipboard',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
        <p className="mt-2 text-muted-foreground">Test and optimize your prompts in real-time</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Input */}
        <div className="space-y-4">
          {/* Prompt */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="system">System Prompt</Label>
                <Textarea
                  id="system"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="mt-2 min-h-20"
                  placeholder="System instructions..."
                />
              </div>

              <div>
                <Label htmlFor="prompt">User Prompt</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-2 min-h-32"
                  placeholder="Enter your prompt..."
                />
              </div>

              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  Words: {prompt.split(' ').length} | Est. Tokens: ~{Math.ceil(prompt.split(' ').length * 1.3)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Model & Parameters */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="model">Model</Label>
                <Select value={model} onValueChange={(val) => val && setModel(val)}>
                  <SelectTrigger id="model" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MODELS).map(([key, m]) => (
                      <SelectItem key={key} value={key}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label>Temperature</Label>
                  <span className="text-sm font-mono text-muted-foreground">{temperature.toFixed(2)}</span>
                </div>
                <Slider
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(Array.isArray(value) ? value[0] : Number(value))}
                  min={0}
                  max={2}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label>Max Tokens</Label>
                  <span className="text-sm font-mono text-muted-foreground">{maxTokens}</span>
                </div>
                <Slider
                  value={[maxTokens]}
                  onValueChange={(value) => setMaxTokens(Array.isArray(value) ? value[0] : Number(value))}
                  min={1}
                  max={4000}
                  step={1}
                  className="mt-2"
                />
              </div>

              <Button onClick={handleRun} disabled={isLoading} className="w-full gap-2" size="lg">
                <Play className="size-4" />
                {isLoading ? 'Running...' : 'Run Prompt'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Output */}
        <div className="space-y-4">
          {/* Response */}
          <Card className="glass">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Response</CardTitle>
                <CardDescription>Output from {selectedModel.name}</CardDescription>
              </div>
              <Button size="sm" variant="ghost" onClick={handleCopyResponse} className="gap-2">
                <Copy className="size-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="min-h-32 rounded-lg bg-muted/50 p-4">
                <p className="text-sm leading-relaxed">{mockResponse.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Metrics */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Input Tokens</span>
                <span className="font-mono font-semibold">{mockResponse.inputTokens}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Output Tokens</span>
                <span className="font-mono font-semibold">{mockResponse.outputTokens}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Tokens</span>
                <span className="font-mono font-semibold">
                  {mockResponse.inputTokens + mockResponse.outputTokens}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cost</span>
                  <span className="font-mono text-lg font-bold">${estimatedCost.toFixed(4)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Latency</span>
                  <span className="font-mono font-semibold">{mockResponse.latency}ms</span>
                </div>
              </div>
              {mockResponse.cacheHit && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-500/10 p-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                    Cache Hit
                  </Badge>
                  <span className="text-xs text-muted-foreground">Saved ${(estimatedCost * 0.8).toFixed(4)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* History Tab */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">History</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="recent" className="flex-1">
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="flex-1">
                    Saved
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="recent" className="mt-4 space-y-2">
                  <div className="text-xs text-muted-foreground">No history yet</div>
                </TabsContent>
                <TabsContent value="saved" className="mt-4 space-y-2">
                  <div className="text-xs text-muted-foreground">No saved prompts yet</div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
