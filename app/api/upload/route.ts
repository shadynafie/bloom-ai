import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { nanoid } from 'nanoid';
import { processImage } from '@/lib/processors/image-processor';
import { processPDF } from '@/lib/processors/pdf-processor';
import { transcribeAudio } from '@/lib/ai/openai';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileId = nanoid();
    const extension = file.name.split('.').pop();
    const fileName = `${fileId}.${extension}`;

    // Create upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    let result: any = {
      url: fileUrl,
      fileName: file.name,
      type,
    };

    // Process based on type
    switch (type) {
      case 'image':
        const imageData = await processImage(buffer);
        result = {
          ...result,
          metadata: imageData.metadata,
        };
        break;

      case 'pdf':
        const pdfData = await processPDF(buffer);
        result = {
          ...result,
          text: pdfData.text,
          metadata: pdfData.metadata,
        };
        break;

      case 'audio':
        // Audio transcription will be done asynchronously
        result = {
          ...result,
          message: 'Audio uploaded. Transcription will be processed.',
        };
        break;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
