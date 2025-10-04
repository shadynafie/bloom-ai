import Anthropic from '@anthropic-ai/sdk';
import { AIModel, AIAction } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ClaudeRequest {
  model: AIModel;
  action: AIAction;
  prompt: string;
  context?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ClaudeResponse {
  content: string;
  tokensUsed: number;
  model: string;
}

export async function callClaude(request: ClaudeRequest): Promise<ClaudeResponse> {
  const {
    model = AIModel.CLAUDE_3_SONNET,
    prompt,
    context = '',
    systemPrompt = 'You are a helpful AI assistant for content creation and research.',
    temperature = 0.7,
    maxTokens = 2000,
  } = request;

  const messages: Anthropic.MessageParam[] = [];

  let fullPrompt = prompt;
  if (context) {
    fullPrompt = `Context:\n${context}\n\nUser request: ${prompt}`;
  }

  messages.push({
    role: 'user',
    content: fullPrompt,
  });

  const message = await anthropic.messages.create({
    model,
    system: systemPrompt,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  const content = message.content[0];
  const text = content.type === 'text' ? content.text : '';

  return {
    content: text,
    tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
    model: message.model,
  };
}

export async function analyzeImageWithClaude(
  imageUrl: string,
  prompt: string,
  mediaType: string = 'image/jpeg'
): Promise<string> {
  // Fetch image and convert to base64
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  const message = await anthropic.messages.create({
    model: AIModel.CLAUDE_3_SONNET,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: base64,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  });

  const content = message.content[0];
  return content.type === 'text' ? content.text : '';
}
