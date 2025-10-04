import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { processVideo } from '@/lib/processors/video-processor';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await processVideo(url);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Video processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process video' },
      { status: 500 }
    );
  }
}
