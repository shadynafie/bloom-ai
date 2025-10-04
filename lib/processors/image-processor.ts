import sharp from 'sharp';
import { analyzeImage } from '../ai/openai';
import { analyzeImageWithClaude } from '../ai/anthropic';

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

export async function processImage(buffer: Buffer): Promise<{
  metadata: ImageMetadata;
  thumbnailUrl?: string;
}> {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    return {
      metadata: {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        size: buffer.length,
      },
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image');
  }
}

export async function createThumbnail(
  buffer: Buffer,
  width: number = 300,
  height: number = 300
): Promise<Buffer> {
  return sharp(buffer)
    .resize(width, height, {
      fit: 'cover',
      position: 'center',
    })
    .toBuffer();
}

export async function extractImageDescription(
  imageUrl: string,
  useModel: 'gpt4' | 'claude' = 'gpt4'
): Promise<string> {
  const prompt = 'Describe this image in detail. What are the key elements, objects, text, or information visible?';

  if (useModel === 'gpt4') {
    return await analyzeImage(imageUrl, prompt);
  } else {
    return await analyzeImageWithClaude(imageUrl, prompt);
  }
}

export async function extractTextFromImage(
  imageUrl: string,
  useModel: 'gpt4' | 'claude' = 'gpt4'
): Promise<string> {
  const prompt = 'Extract all visible text from this image. Return only the text content, preserving formatting where possible.';

  if (useModel === 'gpt4') {
    return await analyzeImage(imageUrl, prompt);
  } else {
    return await analyzeImageWithClaude(imageUrl, prompt);
  }
}

export async function optimizeImage(
  buffer: Buffer,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<Buffer> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 80, format = 'jpeg' } = options;

  let image = sharp(buffer);

  // Resize if needed
  const metadata = await image.metadata();
  if (metadata.width && metadata.width > maxWidth) {
    image = image.resize(maxWidth, null, { withoutEnlargement: true });
  }
  if (metadata.height && metadata.height > maxHeight) {
    image = image.resize(null, maxHeight, { withoutEnlargement: true });
  }

  // Convert to specified format
  switch (format) {
    case 'jpeg':
      image = image.jpeg({ quality });
      break;
    case 'png':
      image = image.png({ quality });
      break;
    case 'webp':
      image = image.webp({ quality });
      break;
  }

  return image.toBuffer();
}
