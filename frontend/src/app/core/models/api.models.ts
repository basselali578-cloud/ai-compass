export interface Tool {
  id: number;
  name: string;
  description: string;
  url: string;
  image_url: string;
  category: string;
  pricing: string;
  rating: number;
  best_for: string;
  beginner_friendly: boolean;
  use_cases: string[];
  pros: string[];
  cons: string[];
  alternatives: string[];
  tutorial_url: string;
  is_new: boolean;
  is_gem: boolean;
  trending_rank: number;
  last_reviewed: string;
  reviewer: string;
  confidence: number;
  review_note: string;
  created_at: string;
}

export interface UseCase {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  tool_count: number;
}

export interface Collection {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  tool_count: number;
}

export interface CollectionDetail extends Collection {
  tools: Tool[];
}

export interface SavedTool {
  save_id: number;
  note: string;
  saved_at: string;
  expires_at: string;
  expires_in_days: number;
  id: number;
  name: string;
  description: string;
  url: string;
  image_url: string;
  category: string;
  pricing: string;
  best_for: string;
  beginner_friendly: boolean;
}

export interface SearchResult {
  query: string;
  data: Tool[];
  total: number;
  matched: number[];
  intent?: { key: string; label: string } | null;
}

export interface AiModel {
  id: number;
  name: string;
  provider: string;
  description: string;
  url: string;
  image_url: string;
  framework: string;
  license: string;
  parameters: string;
  downloads: number;
  likes: number;
  best_for: string;
  runs_locally: boolean;
  requires_gpu: boolean;
  is_free: boolean;
  has_api: boolean;
  on_openrouter: boolean;
  alternatives: string[];
  created_at: string;
}

export interface WorkflowStep {
  id: number;
  workflow_id: number;
  tool_id: number | null;
  title: string;
  note: string;
  why?: string;
  alternative?: string;
  avoid_if?: string;
  sort_order: number;
  tool_name?: string;
  category?: string;
}

export interface Workflow {
  id: number;
  slug: string;
  title: string;
  goal: string;
  summary: string;
  icon: string;
  color: string;
  difficulty: string;
  cost: string;
  time_label: string;
  estimated_minutes: number;
  is_featured: boolean;
  sort_order: number;
  step_count: number;
  linked_count: number;
  why: string[];
  alternative_stacks: string[];
  preview?: { id: number; name: string }[];
  steps?: WorkflowStep[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
