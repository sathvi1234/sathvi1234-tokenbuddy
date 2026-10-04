import { Model, BillingPlan, PlanType } from './types';

// AI Models Configuration
export const MODELS: Record<string, Model> = {
  'gpt-4-turbo': {
    id: 'gpt-4-turbo' as const,
    name: 'GPT-4 Turbo',
    provider: 'openai',
    costPer1kInput: 0.01,
    costPer1kOutput: 0.03,
    contextWindow: 128000,
    maxTokens: 4096,
    speed: 120,
    qualityScore: 95,
    latency: 800,
    description: 'Most capable model, best for complex reasoning',
  },
  'gpt-4o': {
    id: 'gpt-4o' as const,
    name: 'GPT-4o',
    provider: 'openai',
    costPer1kInput: 0.005,
    costPer1kOutput: 0.015,
    contextWindow: 128000,
    maxTokens: 4096,
    speed: 200,
    qualityScore: 92,
    latency: 600,
    description: 'Fast and efficient, excellent all-rounder',
  },
  'gemini-2.5-pro': {
    id: 'gemini-2.5-pro' as const,
    name: 'Gemini 2.5 Pro',
    provider: 'google',
    costPer1kInput: 0.0075,
    costPer1kOutput: 0.03,
    contextWindow: 1000000,
    maxTokens: 8192,
    speed: 180,
    qualityScore: 93,
    latency: 700,
    description: 'Longest context window, great for document processing',
  },
  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash' as const,
    name: 'Gemini 2.5 Flash',
    provider: 'google',
    costPer1kInput: 0.0001,
    costPer1kOutput: 0.0004,
    contextWindow: 1000000,
    maxTokens: 8192,
    speed: 300,
    qualityScore: 88,
    latency: 300,
    description: 'Ultra-fast, budget-friendly option',
  },
  'groq-llama': {
    id: 'groq-llama' as const,
    name: 'Groq Llama 3.1 405B',
    provider: 'groq',
    costPer1kInput: 0.002,
    costPer1kOutput: 0.01,
    contextWindow: 131072,
    maxTokens: 4096,
    speed: 500,
    qualityScore: 87,
    latency: 200,
    description: 'Blazingly fast open-source model',
  },
  'deepseek': {
    id: 'deepseek' as const,
    name: 'DeepSeek V3',
    provider: 'deepseek',
    costPer1kInput: 0.00144,
    costPer1kOutput: 0.0072,
    contextWindow: 64000,
    maxTokens: 4096,
    speed: 250,
    qualityScore: 89,
    latency: 500,
    description: 'Cost-effective with strong reasoning',
  },
  'ollama-local': {
    id: 'ollama-local' as const,
    name: 'Ollama Local',
    provider: 'ollama',
    costPer1kInput: 0,
    costPer1kOutput: 0,
    contextWindow: 32000,
    maxTokens: 2048,
    speed: 100,
    qualityScore: 75,
    latency: 1000,
    description: 'Run locally, zero cost, limited capabilities',
  },
};

// Billing Plans
export const BILLING_PLANS: Record<PlanType, BillingPlan> = {
  free: {
    type: 'free',
    name: 'Free',
    price: 0,
    monthlyRequests: 100,
    costPer1kTokens: 0,
    features: [
      'Up to 100 requests/month',
      'Basic analytics',
      'Community support',
      'Limited cache (1 day)',
    ],
  },
  pro: {
    type: 'pro',
    name: 'Pro',
    price: 29,
    monthlyRequests: 10000,
    costPer1kTokens: 0,
    features: [
      'Up to 10,000 requests/month',
      'Advanced analytics',
      'Prompt optimization',
      'Model routing',
      '30-day cache',
      'Priority support',
      'Team workspace (up to 5 users)',
    ],
  },
  enterprise: {
    type: 'enterprise',
    name: 'Enterprise',
    price: 0, // Custom pricing
    monthlyRequests: 0, // Unlimited
    costPer1kTokens: 0,
    features: [
      'Unlimited requests',
      'Custom SLA',
      'Dedicated account manager',
      'API rate limiting customization',
      'Advanced security (SSO, SAML)',
      'Custom integrations',
      'Audit logs',
      'Webhook support',
      'Multi-region deployment',
    ],
  },
};

// Navigation Items
export const DASHBOARD_NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/dashboard/projects', label: 'Projects', icon: 'Folder' },
  { href: '/dashboard/playground', label: 'Playground', icon: 'Zap' },
  { href: '/dashboard/prompt-optimizer', label: 'Prompt Optimizer', icon: 'Wand2' },
  { href: '/dashboard/model-router', label: 'Model Router', icon: 'GitBranch' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: 'BarChart3' },
  { href: '/dashboard/api-keys', label: 'API Keys', icon: 'Key' },
  { href: '/dashboard/billing', label: 'Billing', icon: 'CreditCard' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'Settings' },
];

// Settings Tabs
export const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile', icon: 'User' },
  { id: 'security', label: 'Security', icon: 'Shield' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell' },
  { id: 'api-providers', label: 'API Providers', icon: 'Code' },
  { id: 'appearance', label: 'Appearance', icon: 'Palette' },
  { id: 'privacy', label: 'Privacy', icon: 'Lock' },
  { id: 'danger', label: 'Danger Zone', icon: 'AlertTriangle' },
];

// Model providers
export const MODEL_PROVIDERS = ['openai', 'google', 'groq', 'deepseek', 'ollama'] as const;

// Toast durations (ms)
export const TOAST_DURATION = {
  SHORT: 2000,
  DEFAULT: 3000,
  LONG: 5000,
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'tokenbuddy_auth_token',
  THEME: 'tokenbuddy_theme',
  USER: 'tokenbuddy_user',
  SELECTED_PROJECT: 'tokenbuddy_selected_project',
};

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  COMMAND_PALETTE: 'cmd+k',
  FOCUS_SEARCH: 'cmd+/',
  NEW_PROJECT: 'cmd+n',
  PLAYGROUND: 'cmd+p',
  TOGGLE_THEME: 'cmd+shift+l',
};
