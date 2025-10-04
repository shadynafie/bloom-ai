# Bloom AI - API Documentation

Complete API reference for Bloom AI backend services.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All API endpoints require authentication via NextAuth session cookies, except where noted.

### Headers

```
Cookie: next-auth.session-token=...
Content-Type: application/json
```

## API Endpoints

### AI Operations

#### Execute AI Request

Process content with AI models for various tasks.

**Endpoint:** `POST /api/ai`

**Request Body:**
```typescript
{
  action: 'summarize' | 'qa' | 'generate' | 'extract' | 'compare' | 'analyze_tone',
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229',
  prompt: string,
  context?: string,
  nodeIds?: string[],
  toneProfileId?: string
}
```

**Response:**
```typescript
{
  content: string,
  creditsUsed: number,
  remainingCredits: number
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/ai \
  -H "Content-Type: application/json" \
  -d '{
    "action": "summarize",
    "model": "gpt-4",
    "prompt": "Summarize this video content",
    "context": "Video transcript: ..."
  }'
```

**Credits Cost:**
- `summarize`: 1 credit
- `qa`: 1 credit
- `extract`: 1 credit
- `generate`: 2 credits
- `compare`: 2 credits
- `analyze_tone`: 2 credits

### Board Management

#### List All Boards

Get all boards owned by or shared with the authenticated user.

**Endpoint:** `GET /api/boards`

**Response:**
```typescript
{
  owned: Board[],
  collaborated: Board[]
}
```

**Example:**
```bash
curl http://localhost:3000/api/boards
```

#### Create Board

Create a new board.

**Endpoint:** `POST /api/boards`

**Request Body:**
```typescript
{
  title: string,
  description?: string
}
```

**Response:**
```typescript
{
  id: string,
  title: string,
  description: string | null,
  userId: string,
  createdAt: string,
  updatedAt: string,
  nodes: [],
  edges: []
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/boards \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Research Project",
    "description": "AI-powered content creation"
  }'
```

#### Get Board

Retrieve a specific board with all nodes and edges.

**Endpoint:** `GET /api/boards/:boardId`

**Response:**
```typescript
{
  id: string,
  title: string,
  description: string | null,
  userId: string,
  nodes: Node[],
  edges: Edge[],
  collaborators: Collaborator[],
  createdAt: string,
  updatedAt: string
}
```

#### Update Board

Update board metadata, nodes, or edges.

**Endpoint:** `PATCH /api/boards/:boardId`

**Request Body:**
```typescript
{
  title?: string,
  description?: string,
  nodes?: Node[],
  edges?: Edge[]
}
```

**Example:**
```bash
curl -X PATCH http://localhost:3000/api/boards/board_123 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "nodes": [...]
  }'
```

#### Delete Board

Delete a board and all associated content.

**Endpoint:** `DELETE /api/boards/:boardId`

**Response:**
```typescript
{
  success: true
}
```

### Content Processing

#### Process Video

Extract metadata and transcription from video URLs.

**Endpoint:** `POST /api/process/video`

**Request Body:**
```typescript
{
  url: string  // YouTube, Vimeo, TikTok URL
}
```

**Response:**
```typescript
{
  metadata: {
    title?: string,
    description?: string,
    duration?: number,
    thumbnailUrl?: string,
    platform: 'youtube' | 'vimeo' | 'tiktok' | 'other',
    author?: string,
    publishedAt?: string
  },
  transcription?: string
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/process/video \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }'
```

#### Process Web Page

Extract content from a web page URL.

**Endpoint:** `POST /api/process/webpage`

**Request Body:**
```typescript
{
  url: string
}
```

**Response:**
```typescript
{
  content: string,
  metadata: {
    title?: string,
    description?: string,
    author?: string,
    publishedDate?: string,
    favicon?: string,
    ogImage?: string
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/process/webpage \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/article"
  }'
```

### File Upload

#### Upload File

Upload PDF, image, or audio files.

**Endpoint:** `POST /api/upload`

**Request:** `multipart/form-data`

**Fields:**
- `file`: File (required)
- `type`: 'pdf' | 'image' | 'audio' (required)

**Response:**
```typescript
{
  url: string,
  fileName: string,
  type: string,
  metadata?: object,
  text?: string,  // For PDFs
  message?: string  // Status message
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@document.pdf" \
  -F "type=pdf"
```

**File Size Limits:**
- PDF: 50MB
- Image: 10MB
- Audio: 100MB

**Supported Formats:**
- PDF: `.pdf`
- Image: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- Audio: `.mp3`, `.wav`, `.m4a`, `.ogg`

### Node Operations

#### Create Node

Nodes are created as part of board updates via `PATCH /api/boards/:boardId`

**Node Structure:**
```typescript
{
  id: string,
  type: 'TEXT' | 'VIDEO' | 'AUDIO' | 'PDF' | 'IMAGE' | 'WEB_PAGE' | 'AI_CHAT',
  position: { x: number, y: number },
  data: {
    label: string,
    type: NodeType,
    group?: 'tone' | 'reference' | 'content',
    tags?: string[],
    // Type-specific fields
    ...
  },
  width?: number,
  height?: number
}
```

### User & Credits

#### Get User Credits

Check remaining AI credits.

**Endpoint:** `GET /api/user/credits`

**Response:**
```typescript
{
  total: number,
  used: number,
  remaining: number,
  resetDate: string
}
```

#### Get AI Interaction History

View past AI interactions.

**Endpoint:** `GET /api/user/interactions`

**Query Parameters:**
- `limit`: number (default: 50)
- `offset`: number (default: 0)

**Response:**
```typescript
{
  interactions: [{
    id: string,
    model: string,
    action: string,
    prompt: string,
    response: string,
    tokensUsed: number,
    creditsUsed: number,
    createdAt: string
  }],
  total: number
}
```

## WebSocket Events

For real-time collaboration features.

**Connection:** `wss://your-domain.com`

### Client → Server Events

#### Join Board
```typescript
socket.emit('join-board', { boardId: string })
```

#### Board Update
```typescript
socket.emit('board-update', {
  boardId: string,
  nodes: Node[],
  edges: Edge[]
})
```

#### Cursor Position
```typescript
socket.emit('cursor-move', {
  boardId: string,
  position: { x: number, y: number }
})
```

### Server → Client Events

#### Board Updated
```typescript
socket.on('board-updated', (data: {
  boardId: string,
  nodes: Node[],
  edges: Edge[],
  userId: string
}) => {})
```

#### User Joined
```typescript
socket.on('user-joined', (data: {
  boardId: string,
  user: { id: string, name: string }
}) => {})
```

#### Cursor Update
```typescript
socket.on('cursor-update', (data: {
  userId: string,
  position: { x: number, y: number }
}) => {})
```

## Error Responses

All endpoints return errors in this format:

```typescript
{
  error: string,
  details?: any
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions/credits)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited per user:

- AI Operations: 60 requests/minute
- Board Operations: 120 requests/minute
- File Upload: 20 requests/minute
- Other endpoints: 100 requests/minute

**Rate Limit Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640000000
```

## Webhook Events

Configure webhooks in your account settings to receive events.

**Webhook URL:** Set in settings

**Events:**
- `board.created`
- `board.updated`
- `board.deleted`
- `ai.interaction.completed`
- `credits.low` (< 100 remaining)
- `credits.depleted`

**Payload Format:**
```typescript
{
  event: string,
  timestamp: string,
  data: object
}
```

**Webhook Signature:**

Verify webhook authenticity using HMAC signature in `X-Bloom-Signature` header.

## SDKs

### JavaScript/TypeScript

```typescript
import { BloomClient } from '@bloom-ai/sdk';

const client = new BloomClient({
  apiKey: 'your-api-key'
});

// Create board
const board = await client.boards.create({
  title: 'My Board'
});

// Execute AI request
const result = await client.ai.execute({
  action: 'summarize',
  model: 'gpt-4',
  prompt: 'Summarize this...',
  context: '...'
});
```

### Python

```python
from bloom_ai import BloomClient

client = BloomClient(api_key='your-api-key')

# Create board
board = client.boards.create(
    title='My Board'
)

# Execute AI request
result = client.ai.execute(
    action='summarize',
    model='gpt-4',
    prompt='Summarize this...',
    context='...'
)
```

## Best Practices

1. **Batch Operations**: Use board update to modify multiple nodes at once
2. **Caching**: Cache transcriptions and processed content
3. **Credits**: Monitor credit usage and implement alerts
4. **Error Handling**: Always handle rate limits and retry with backoff
5. **WebSocket**: Implement reconnection logic for real-time features

## Support

- **API Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [Full Docs](README.md)
- **Email**: api-support@bloom-ai.com

---

**Version:** 1.0.0
**Last Updated:** 2024
