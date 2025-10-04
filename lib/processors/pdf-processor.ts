import pdf from 'pdf-parse';

export interface PDFMetadata {
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creationDate?: Date;
}

export async function processPDF(buffer: Buffer): Promise<{
  text: string;
  metadata: PDFMetadata;
}> {
  try {
    const data = await pdf(buffer);

    const metadata: PDFMetadata = {
      pageCount: data.numpages,
      title: data.info?.Title,
      author: data.info?.Author,
      subject: data.info?.Subject,
      keywords: data.info?.Keywords,
      creationDate: data.info?.CreationDate,
    };

    return {
      text: data.text,
      metadata,
    };
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF');
  }
}

export async function extractPDFFromUrl(url: string): Promise<{
  text: string;
  metadata: PDFMetadata;
}> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return processPDF(buffer);
}

export function chunkPDFText(text: string, chunkSize: number = 4000): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);

  let currentChunk = '';

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > chunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      // If a single paragraph is larger than chunk size, split it
      if (paragraph.length > chunkSize) {
        const words = paragraph.split(' ');
        for (const word of words) {
          if (currentChunk.length + word.length > chunkSize) {
            chunks.push(currentChunk.trim());
            currentChunk = word + ' ';
          } else {
            currentChunk += word + ' ';
          }
        }
      } else {
        currentChunk = paragraph + '\n\n';
      }
    } else {
      currentChunk += paragraph + '\n\n';
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
