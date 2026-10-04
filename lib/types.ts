// Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Projects
export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  apiKey: string;
  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  totalRequests: number;
  monthlyCost: number;
  cacheHitRate: number;
}

// Prompts & Responses
export interface Prompt {
  id: string;
  userId: string;
  projectId: string;
  content: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  createdAt: Date;
}

export interface Response {
  id: string;
  promptId: string;
  content: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  latency: number; // in milliseconds
  model: string;
  cacheHit: boolean;
  createdAt: Date;
}

// Models
export type ModelId = 'gpt-4-turbo' | 'gpt-4o' | 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'groq-llama' | 'deepseek' | 'ollama-local';

export interface Model {
  id: ModelId;
  name: string;
  provider: 'openai' | 'google' | 'groq' | 'deepseek' | 'ollama';
  costPer1kInput: number; // in USD
  costPer1kOutput: number; // in USD
  contextWindow: number;
  maxTokens: number;
  speed: number; // tokens per second estimate
  qualityScore: number; // 0-100
  latency: number; // average latency in ms
  description: string;
}

// Analytics
export interface AnalyticsMetrics {
  date: Date;
  requests: number;
  totalTokens: number;
  totalCost: number;
  cacheHits: number;
  cacheMisses: number;
  avgLatency: number;
  modelUsage: Record<ModelId, number>;
  carbonFootprint: number; // kg CO2
}

export interface DashboardStats {
  totalRequests: number;
  totalTokens: number;
  aiCost: number;
  moneySaved: number;
  cacheHitRate: number;
  activeModels: string[];
  avgLatency: number;
  carbonFootprint: number;
}

// API Keys
export interface ApiKey {
  id: string;
  userId: string;
  projectId: string;
  key: string;
  name: string;
  createdAt: Date;
  lastUsed?: Date;
  rateLimit: number; // requests per minute
  usage: number;
}

// Billing
export type PlanType = 'free' | 'pro' | 'enterprise';

export interface BillingPlan {
  type: PlanType;
  name: string;
  price: number;
  monthlyRequests: number;
  costPer1kTokens: number;
  features: string[];
}

export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  createdAt: Date;
  paidAt?: Date;
  dueDate: Date;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface UsageData {
  currentPlan: PlanType;
  tokensUsed: number;
  tokensLimit: number;
  requestsUsed: number;
  requestsLimit: number;
  currentMonthCost: number;
  estimatedTotalCost: number;
}

// Prompt Optimization
export interface OptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  shortPrompt: string;
  qualityScore: number; // 0-100
  improvements: string[];
  estimatedTokenReduction: number;
  estimatedCostSavings: number;
  comparisonMetrics: {
    originalTokens: number;
    optimizedTokens: number;
    shortTokens: number;
    originalCost: number;
    optimizedCost: number;
    shortCost: number;
  };
}

// Model Router
export interface RoutingAnalysis {
  promptComplexity: number; // 0-100
  recommendedModel: ModelId;
  reason: string;
  alternatives: {
    modelId: ModelId;
    reason: string;
    score: number;
  }[];
  metrics: {
    estimatedCost: number;
    estimatedLatency: number;
    qualityRating: number;
  };
}

// Cache
export interface CacheEntry {
  id: string;
  promptHash: string;
  originalPrompt: string;
  response: string;
  similarity: number; // 0-100
  inputTokens: number;
  outputTokens: number;
  cost: number;
  timeSaved: number; // milliseconds
  moneySaved: number;
  createdAt: Date;
  accessCount: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Store Types
export interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export interface DashboardState {
  selectedProject: string | null;
  setSelectedProject: (projectId: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export interface UIState {
  modals: Record<string, boolean>;
  openModal: (name: string) => void;
  closeModal: (name: string) => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
