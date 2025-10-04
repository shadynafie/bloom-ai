import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { extractWebPageContent } from '@/lib/processors/web-processor';

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

    const result = await extractWebPageContent(url);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Webpage processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webpage' },
      { status: 500 }
    );
  }
}
