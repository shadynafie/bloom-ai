import * as cheerio from 'cheerio';
import { fetchWithTimeout } from '../utils';

export interface WebPageMetadata {
  title?: string;
  description?: string;
  author?: string;
  publishedDate?: string;
  favicon?: string;
  ogImage?: string;
}

export async function extractWebPageContent(url: string): Promise<{
  content: string;
  metadata: WebPageMetadata;
}> {
  try {
    const response = await fetchWithTimeout(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    // Remove script and style tags
    $('script, style, nav, footer, aside, .ad, .advertisement').remove();

    // Extract metadata
    const metadata: WebPageMetadata = {
      title: $('title').text() || $('meta[property="og:title"]').attr('content'),
      description:
        $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content'),
      author:
        $('meta[name="author"]').attr('content') ||
        $('meta[property="article:author"]').attr('content'),
      publishedDate: $('meta[property="article:published_time"]').attr('content'),
      favicon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href'),
      ogImage: $('meta[property="og:image"]').attr('content'),
    };

    // Extract main content
    let content = '';

    // Try to find main content area
    const mainContent =
      $('article').first() || $('main').first() || $('.post-content').first() || $('body');

    // Extract text from paragraphs and headings
    mainContent.find('p, h1, h2, h3, h4, h5, h6, li').each((_, elem) => {
      const text = $(elem).text().trim();
      if (text) {
        content += text + '\n\n';
      }
    });

    // Fallback to all text if no structured content found
    if (!content.trim()) {
      content = $('body').text().trim();
    }

    // Clean up whitespace
    content = content
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();

    return { content, metadata };
  } catch (error) {
    console.error('Error extracting web page content:', error);
    throw new Error('Failed to extract web page content');
  }
}

export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.href;
  } catch {
    // Try adding https://
    try {
      const urlObj = new URL(`https://${url}`);
      return urlObj.href;
    } catch {
      throw new Error('Invalid URL');
    }
  }
}

export async function extractArticleText(url: string): Promise<string> {
  const { content } = await extractWebPageContent(url);
  return content;
}
