import { transcribeAudio } from '../ai/openai';
import { fetchWithTimeout } from '../utils';

export interface VideoMetadata {
  title?: string;
  description?: string;
  duration?: number;
  thumbnailUrl?: string;
  platform: 'youtube' | 'vimeo' | 'tiktok' | 'other';
  author?: string;
  publishedAt?: string;
}

export async function extractYouTubeId(url: string): Promise<string | null> {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export async function getYouTubeMetadata(videoId: string): Promise<VideoMetadata> {
  try {
    // Use YouTube oEmbed API (no API key required)
    const response = await fetchWithTimeout(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );

    const data = await response.json();

    return {
      title: data.title,
      author: data.author_name,
      thumbnailUrl: data.thumbnail_url,
      platform: 'youtube',
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return { platform: 'youtube' };
  }
}

export async function getYouTubeTranscript(videoId: string): Promise<string> {
  try {
    // Try to fetch captions from YouTube
    const response = await fetchWithTimeout(
      `https://www.youtube.com/watch?v=${videoId}`
    );
    const html = await response.text();

    // Extract captions from the page (this is a simplified approach)
    // In production, you'd want to use a proper YouTube API or caption parser
    const captionsMatch = html.match(/"captions":\s*({[^}]+})/);

    if (captionsMatch) {
      // Parse and return captions
      // This is a placeholder - you'd implement proper caption extraction here
      return 'Captions extracted from YouTube';
    }

    // Fallback: indicate that transcription is needed
    throw new Error('No captions available');
  } catch (error) {
    // If no captions, we'll need to use audio transcription
    throw new Error('Transcription service needed');
  }
}

export async function processVideo(url: string): Promise<{
  metadata: VideoMetadata;
  transcription?: string;
}> {
  // Detect platform
  const youtubeId = await extractYouTubeId(url);

  if (youtubeId) {
    const metadata = await getYouTubeMetadata(youtubeId);

    try {
      const transcription = await getYouTubeTranscript(youtubeId);
      return { metadata, transcription };
    } catch {
      // Transcription will be done via audio extraction later
      return { metadata };
    }
  }

  // Handle other platforms (TikTok, Vimeo, etc.)
  // For now, return basic metadata
  return {
    metadata: {
      platform: 'other',
    },
  };
}

export async function transcribeVideoAudio(audioUrl: string): Promise<string> {
  return await transcribeAudio(audioUrl);
}
