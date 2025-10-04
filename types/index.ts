import { Node as FlowNode, Edge as FlowEdge } from 'reactflow';

export enum NodeType {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  PDF = 'PDF',
  IMAGE = 'IMAGE',
  WEB_PAGE = 'WEB_PAGE',
  AI_CHAT = 'AI_CHAT',
  TONE_PROFILE = 'TONE_PROFILE',
}

export enum MediaType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  PDF = 'PDF',
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
}

export enum AIModel {
  GPT4 = 'gpt-4',
  GPT35_TURBO = 'gpt-3.5-turbo',
  CLAUDE_3_OPUS = 'claude-3-opus-20240229',
  CLAUDE_3_SONNET = 'claude-3-sonnet-20240229',
  CLAUDE_3_HAIKU = 'claude-3-haiku-20240307',
}

export enum AIAction {
  SUMMARIZE = 'summarize',
  QA = 'qa',
  GENERATE = 'generate',
  EXTRACT = 'extract',
  COMPARE = 'compare',
  ANALYZE_TONE = 'analyze_tone',
}

export interface BaseNodeData {
  label: string;
  type: NodeType;
  group?: 'tone' | 'reference' | 'content';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TextNodeData extends BaseNodeData {
  type: NodeType.TEXT;
  content: string;
  format?: 'plain' | 'markdown' | 'html';
}

export interface VideoNodeData extends BaseNodeData {
  type: NodeType.VIDEO;
  url: string;
  platform?: 'youtube' | 'vimeo' | 'tiktok' | 'other';
  thumbnailUrl?: string;
  duration?: number;
  transcription?: string;
  summary?: string;
  metadata?: Record<string, any>;
}

export interface AudioNodeData extends BaseNodeData {
  type: NodeType.AUDIO;
  url: string;
  duration?: number;
  transcription?: string;
  summary?: string;
}

export interface PDFNodeData extends BaseNodeData {
  type: NodeType.PDF;
  url: string;
  fileName: string;
  pageCount?: number;
  extractedText?: string;
  summary?: string;
}

export interface ImageNodeData extends BaseNodeData {
  type: NodeType.IMAGE;
  url: string;
  fileName: string;
  width?: number;
  height?: number;
  description?: string;
  extractedText?: string; // OCR
}

export interface WebPageNodeData extends BaseNodeData {
  type: NodeType.WEB_PAGE;
  url: string;
  title?: string;
  content?: string;
  summary?: string;
  favicon?: string;
}

export interface AIChatNodeData extends BaseNodeData {
  type: NodeType.AI_CHAT;
  messages: ChatMessage[];
  model: AIModel;
}

export interface ToneProfileNodeData extends BaseNodeData {
  type: NodeType.TONE_PROFILE;
  profileId: string;
  samples: string[];
  analysis?: {
    tone: string;
    style: string;
    vocabulary: string[];
    patterns: string[];
  };
}

export type NodeData =
  | TextNodeData
  | VideoNodeData
  | AudioNodeData
  | PDFNodeData
  | ImageNodeData
  | WebPageNodeData
  | AIChatNodeData
  | ToneProfileNodeData;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: AIModel;
}

export interface AIRequest {
  action: AIAction;
  model: AIModel;
  nodeIds?: string[]; // Context nodes
  prompt: string;
  context?: string;
  toneProfileId?: string;
}

export interface AIResponse {
  content: string;
  model: AIModel;
  tokensUsed?: number;
  creditsUsed: number;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  nodes: FlowNode<NodeData>[];
  edges: FlowEdge[];
}

export interface UserCredits {
  total: number;
  used: number;
  remaining: number;
  resetDate: string;
}

export interface ProcessingStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  message?: string;
  error?: string;
}

export interface ContentGroup {
  id: string;
  type: 'tone' | 'reference' | 'content';
  nodeIds: string[];
  label: string;
  color?: string;
}
