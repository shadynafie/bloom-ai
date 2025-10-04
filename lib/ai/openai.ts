import OpenAI from 'openai';
import { AIModel, AIAction } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface OpenAIRequest {
  model: AIModel;
  action: AIAction;
  prompt: string;
  context?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface OpenAIResponse {
  content: string;
  tokensUsed: number;
  model: string;
}

export async function callOpenAI(request: OpenAIRequest): Promise<OpenAIResponse> {
  const {
    model = AIModel.GPT4,
    prompt,
    context = '',
    systemPrompt,
    temperature = 0.7,
    maxTokens = 2000,
  } = request;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

  if (systemPrompt) {
    messages.push({
      role: 'system',
      content: systemPrompt,
    });
  }

  if (context) {
    messages.push({
      role: 'system',
      content: `Context:\n${context}`,
    });
  }

  messages.push({
    role: 'user',
    content: prompt,
  });

  const completion = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  return {
    content: completion.choices[0]?.message?.content || '',
    tokensUsed: completion.usage?.total_tokens || 0,
    model: completion.model,
  };
}

export async function transcribeAudio(audioUrl: string): Promise<string> {
  // Download audio file
  const response = await fetch(audioUrl);
  const audioBlob = await response.blob();

  // Convert to File object
  const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mpeg' });

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
  });

  return transcription.text;
}

export async function analyzeImage(imageUrl: string, prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
    max_tokens: 1000,
  });

  return completion.choices[0]?.message?.content || '';
}

export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}
