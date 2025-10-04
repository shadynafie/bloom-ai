import { AIModel, AIAction, AIRequest, AIResponse } from '@/types';
import { callOpenAI } from './openai';
import { callClaude } from './anthropic';

const CREDITS_PER_ACTION: Record<AIAction, number> = {
  [AIAction.SUMMARIZE]: 1,
  [AIAction.QA]: 1,
  [AIAction.GENERATE]: 2,
  [AIAction.EXTRACT]: 1,
  [AIAction.COMPARE]: 2,
  [AIAction.ANALYZE_TONE]: 2,
};

const ACTION_SYSTEM_PROMPTS: Record<AIAction, string> = {
  [AIAction.SUMMARIZE]: 'You are an expert at creating concise, accurate summaries. Extract the key points and main ideas from the provided content.',
  [AIAction.QA]: 'You are a knowledgeable assistant. Answer questions based on the provided context accurately and concisely.',
  [AIAction.GENERATE]: 'You are a creative content generator. Create engaging, well-structured content based on the provided context and instructions.',
  [AIAction.EXTRACT]: 'You are an information extraction expert. Extract specific information, patterns, or insights from the provided content.',
  [AIAction.COMPARE]: 'You are an analytical expert. Compare and contrast multiple sources, identifying similarities, differences, and patterns.',
  [AIAction.ANALYZE_TONE]: 'You are a writing style analyst. Analyze the tone, voice, vocabulary, and patterns in the provided content.',
};

export class AIService {
  static async executeAIRequest(request: AIRequest): Promise<AIResponse> {
    const { action, model, prompt, context, toneProfileId } = request;

    const systemPrompt = ACTION_SYSTEM_PROMPTS[action];
    const creditsUsed = CREDITS_PER_ACTION[action];

    let response;

    // Route to appropriate AI model
    if (model.startsWith('gpt')) {
      response = await callOpenAI({
        model,
        action,
        prompt,
        context,
        systemPrompt,
      });
    } else if (model.startsWith('claude')) {
      response = await callClaude({
        model,
        action,
        prompt,
        context,
        systemPrompt,
      });
    } else {
      throw new Error(`Unsupported AI model: ${model}`);
    }

    return {
      content: response.content,
      model,
      tokensUsed: response.tokensUsed,
      creditsUsed,
    };
  }

  static async summarizeContent(
    content: string,
    model: AIModel = AIModel.GPT4,
    customInstructions?: string
  ): Promise<string> {
    const prompt = customInstructions
      ? `${customInstructions}\n\nContent to summarize:\n${content}`
      : `Provide a concise summary of the following content:\n\n${content}`;

    const response = await this.executeAIRequest({
      action: AIAction.SUMMARIZE,
      model,
      prompt,
    });

    return response.content;
  }

  static async answerQuestion(
    question: string,
    context: string,
    model: AIModel = AIModel.GPT4
  ): Promise<string> {
    const response = await this.executeAIRequest({
      action: AIAction.QA,
      model,
      prompt: question,
      context,
    });

    return response.content;
  }

  static async generateContent(
    instructions: string,
    context: string,
    model: AIModel = AIModel.GPT4,
    toneProfileId?: string
  ): Promise<string> {
    const response = await this.executeAIRequest({
      action: AIAction.GENERATE,
      model,
      prompt: instructions,
      context,
      toneProfileId,
    });

    return response.content;
  }

  static async extractKeyPoints(
    content: string,
    model: AIModel = AIModel.GPT4
  ): Promise<string[]> {
    const prompt = `Extract the key points, hooks, or important takeaways from the following content. Return as a bulleted list:\n\n${content}`;

    const response = await this.executeAIRequest({
      action: AIAction.EXTRACT,
      model,
      prompt,
    });

    // Parse bulleted list from response
    const lines = response.content.split('\n').filter(line => line.trim());
    return lines.map(line => line.replace(/^[-*•]\s*/, '').trim());
  }

  static async compareSources(
    sources: { label: string; content: string }[],
    model: AIModel = AIModel.GPT4
  ): Promise<string> {
    const context = sources
      .map((source, idx) => `Source ${idx + 1} (${source.label}):\n${source.content}`)
      .join('\n\n---\n\n');

    const prompt = 'Compare these sources and identify common themes, differences, and key insights:';

    const response = await this.executeAIRequest({
      action: AIAction.COMPARE,
      model,
      prompt,
      context,
    });

    return response.content;
  }

  static async analyzeTone(
    samples: string[],
    model: AIModel = AIModel.GPT4
  ): Promise<{
    tone: string;
    style: string;
    vocabulary: string[];
    patterns: string[];
  }> {
    const context = samples.join('\n\n---\n\n');
    const prompt = `Analyze the writing style, tone, vocabulary, and patterns in these samples. Provide:
1. Overall tone (e.g., professional, casual, humorous)
2. Writing style characteristics
3. Common vocabulary or phrases
4. Structural patterns or techniques

Return in JSON format with keys: tone, style, vocabulary (array), patterns (array)`;

    const response = await this.executeAIRequest({
      action: AIAction.ANALYZE_TONE,
      model,
      prompt,
      context,
    });

    try {
      return JSON.parse(response.content);
    } catch {
      // Fallback parsing
      return {
        tone: 'Unknown',
        style: response.content,
        vocabulary: [],
        patterns: [],
      };
    }
  }

  static selectBestModel(action: AIAction): AIModel {
    // Smart model selection based on action type
    switch (action) {
      case AIAction.GENERATE:
      case AIAction.ANALYZE_TONE:
        return AIModel.CLAUDE_3_OPUS; // Better for creative tasks
      case AIAction.EXTRACT:
      case AIAction.COMPARE:
        return AIModel.GPT4; // Better for analytical tasks
      case AIAction.SUMMARIZE:
      case AIAction.QA:
      default:
        return AIModel.GPT35_TURBO; // Faster and cheaper
    }
  }
}
