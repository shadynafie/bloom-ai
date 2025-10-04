import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { AIService } from '@/lib/ai/ai-service';
import { AIAction, AIModel } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check credits
    const remainingCredits = user.credits - user.creditsUsed;
    if (remainingCredits <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, model, prompt, context, nodeIds, toneProfileId } = body;

    // Validate request
    if (!action || !model || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Execute AI request
    const response = await AIService.executeAIRequest({
      action: action as AIAction,
      model: model as AIModel,
      prompt,
      context,
      nodeIds,
      toneProfileId,
    });

    // Update user credits
    await prisma.user.update({
      where: { id: user.id },
      data: {
        creditsUsed: {
          increment: response.creditsUsed,
        },
      },
    });

    // Log interaction
    await prisma.aIInteraction.create({
      data: {
        userId: user.id,
        model: response.model,
        action,
        prompt,
        response: response.content,
        tokensUsed: response.tokensUsed,
        creditsUsed: response.creditsUsed,
      },
    });

    return NextResponse.json({
      content: response.content,
      creditsUsed: response.creditsUsed,
      remainingCredits: remainingCredits - response.creditsUsed,
    });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
