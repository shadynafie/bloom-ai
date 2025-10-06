'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Node, Edge } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NodeData, NodeType } from '@/types';
import {
  Plus,
  Video,
  FileText,
  Image as ImageIcon,
  Globe,
  Sparkles,
  Upload,
  Download,
  Users,
  Settings,
} from 'lucide-react';

const Canvas = dynamic(() => import('@/components/canvas/Canvas'), {
  ssr: false,
});

export default function BoardPage({ params }: { params: { boardId: string } }) {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [boardTitle, setBoardTitle] = useState('Untitled Board');
  const [boardDescription, setBoardDescription] = useState<string | null>(null);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [credits, setCredits] = useState<{
    total: number;
    used: number;
    remaining: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showWebDialog, setShowWebDialog] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [processing, setProcessing] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);

  const creditProgress = useMemo(() => {
    if (!credits || credits.total === 0) return 0;
    return Math.min((credits.remaining / credits.total) * 100, 100);
  }, [credits]);

  const creditLabel = useMemo(() => {
    if (!credits) return '—';
    return `${credits.remaining} / ${credits.total}`;
  }, [credits]);

  useEffect(() => {
    const loadBoard = async () => {
      setLoadingBoard(true);
      setLoadError(null);

      try {
        const response = await fetch(`/api/boards/${params.boardId}`);

        if (!response.ok) {
          throw new Error('Failed to load board');
        }

        const board = await response.json();

        setBoardTitle(board.title ?? 'Untitled Board');
        setBoardDescription(board.description ?? null);

        if (Array.isArray(board.nodes)) {
          const deserializedNodes: Node<NodeData>[] = board.nodes.map((node: any) => {
            const rawData = (node.data ?? {}) as NodeData;
            const resolvedType = (rawData?.type as NodeType) ?? node.type ?? NodeType.TEXT;

            return {
              id: node.id,
              type: resolvedType,
              position: (node.position as { x: number; y: number }) ?? { x: 0, y: 0 },
              data: {
                ...rawData,
                type: resolvedType,
                label: rawData?.label ?? 'Untitled',
                createdAt:
                  rawData?.createdAt ??
                  (node.createdAt ? new Date(node.createdAt).toISOString() : new Date().toISOString()),
                updatedAt:
                  rawData?.updatedAt ??
                  (node.updatedAt ? new Date(node.updatedAt).toISOString() : new Date().toISOString()),
              } as NodeData,
              width: node.width ?? undefined,
              height: node.height ?? undefined,
            };
          });

          setNodes(deserializedNodes);
        } else {
          setNodes([]);
        }

        if (Array.isArray(board.edges)) {
          const deserializedEdges: Edge[] = board.edges.map((edge: any) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type ?? 'default',
            animated: edge.animated ?? false,
            label: edge.label ?? undefined,
            data: edge.data ?? undefined,
          }));

          setEdges(deserializedEdges);
        } else {
          setEdges([]);
        }
      } catch (error) {
        console.error('Failed to load board:', error);
        setLoadError('Unable to load this board. Please refresh or try again later.');
        setNodes([]);
        setEdges([]);
      } finally {
        setLoadingBoard(false);
      }
    };

    const loadCredits = async () => {
      try {
        const response = await fetch('/api/settings');

        if (!response.ok) {
          throw new Error('Failed to load credits');
        }

        const data = await response.json();

        if (data?.user) {
          const total = data.user.credits ?? 0;
          const used = data.user.creditsUsed ?? 0;
          const remaining = Math.max(total - used, 0);

          setCredits({ total, used, remaining });
        }
      } catch (error) {
        console.error('Failed to load credits:', error);
      }
    };

    loadBoard();
    loadCredits();
  }, [params.boardId]);

  useEffect(() => {
    hasInitializedRef.current = false;
  }, [params.boardId]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const persistBoard = useCallback(
    async (nodesToPersist: Node<NodeData>[], edgesToPersist: Edge[]) => {
      if (!nodesToPersist && !edgesToPersist) return;

      try {
        setIsSaving(true);
        setSaveError(null);

        const payload = {
          nodes: nodesToPersist.map((node) => ({
            id: node.id,
            type: (node.type as NodeType) ?? node.data.type,
            position: node.position,
            data: {
              ...node.data,
              updatedAt: new Date().toISOString(),
            },
            width: node.width,
            height: node.height,
          })),
          edges: edgesToPersist.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type ?? 'default',
            animated: edge.animated ?? false,
            label: edge.label,
            data: edge.data ?? undefined,
          })),
        };

        const response = await fetch(`/api/boards/${params.boardId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to save board');
        }
      } catch (error) {
        console.error('Failed to save board state:', error);
        setSaveError('Unable to save changes');
      } finally {
        setIsSaving(false);
      }
    },
    [params.boardId]
  );

  useEffect(() => {
    if (loadingBoard || loadError) return;

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      persistBoard(nodes, edges);
      saveTimeoutRef.current = null;
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [nodes, edges, loadingBoard, loadError, persistBoard]);

  const addVideoNode = async () => {
    if (!videoUrl.trim()) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/process/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        const metadata = (data.metadata ?? {}) as Record<string, any>;
        const transcription = data.transcription ?? data.transcript;
        const platform = (metadata.platform as 'youtube' | 'vimeo' | 'tiktok' | 'other') ?? 'other';

        // Create new video node on canvas
        const newNode: Node<NodeData> = {
          id: `video-${Date.now()}`,
          type: NodeType.VIDEO,
          position: { x: 250, y: 250 },
          data: {
            type: NodeType.VIDEO,
            label: metadata.title ?? 'Video',
            url: videoUrl,
            thumbnailUrl: metadata.thumbnailUrl,
            duration: metadata.duration,
            transcription,
            summary: data.summary,
            platform,
            metadata,
            group: 'reference',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };

        setNodes((prev) => [...prev, newNode]);
        setVideoUrl('');
        setShowVideoDialog(false);
      } else {
        alert('Failed to process video. Please check the URL and try again.');
      }
    } catch (error) {
      console.error('Video processing error:', error);
      alert('Error processing video. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const addWebPageNode = async () => {
    if (!webUrl.trim()) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/process/webpage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        const metadata = (data.metadata ?? {}) as Record<string, any>;

        const newNode: Node<NodeData> = {
          id: `webpage-${Date.now()}`,
          type: NodeType.WEB_PAGE,
          position: { x: 250, y: 250 },
          data: {
            type: NodeType.WEB_PAGE,
            label: metadata.title ?? 'Web Page',
            url: webUrl,
            title: metadata.title,
            content: data.content,
            summary: data.summary,
            favicon: metadata.favicon,
            group: 'reference',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };

        setNodes((prev) => [...prev, newNode]);
        setWebUrl('');
        setShowWebDialog(false);
      } else {
        alert('Failed to scrape webpage. Please check the URL and try again.');
      }
    } catch (error) {
      console.error('Webpage processing error:', error);
      alert('Error processing webpage. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'pdf' | 'image' | 'audio') => {
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        const nodeType = type === 'pdf' ? NodeType.PDF : type === 'image' ? NodeType.IMAGE : NodeType.AUDIO;

        const newNode: Node<NodeData> = {
          id: `${type}-${Date.now()}`,
          type: nodeType,
          position: { x: 250, y: 250 },
          data: {
            type: nodeType,
            label: data.fileName || `${type.toUpperCase()} File`,
            url: data.url,
            fileName: data.fileName,
            ...(type === 'pdf' && {
              extractedText: data.text,
              pageCount: data.metadata?.pageCount,
            }),
            ...(type === 'image' && {
              description: data.metadata?.description,
              extractedText: data.text,
            }),
            ...(type === 'audio' && {
              transcription: data.text,
              duration: data.metadata?.duration,
            }),
            group: 'reference',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };

        setNodes((prev) => [...prev, newNode]);
        alert(`${type.toUpperCase()} uploaded successfully!`);
      } else {
        alert(`Failed to upload ${type}. Please try again.`);
      }
    } catch (error) {
      console.error(`${type} upload error:`, error);
      alert(`Error uploading ${type}. Please try again.`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">
                {loadingBoard ? 'Loading board…' : boardTitle}
              </h1>
              {loadError && (
                <span className="text-xs text-red-500">Failed to load</span>
              )}
            </div>
            {boardDescription && !loadingBoard && (
              <p className="text-xs text-muted-foreground truncate max-w-xs">
                {boardDescription}
              </p>
            )}
            {!loadingBoard && (
              <div className="flex items-center gap-2 mt-1">
                {isSaving && (
                  <span className="text-xs text-muted-foreground">Saving…</span>
                )}
                {saveError && !isSaving && (
                  <span className="text-xs text-red-500">{saveError}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-border bg-card p-4 space-y-2">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Content
          </h2>

          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
            onClick={() => setShowVideoDialog(true)}
          >
            <Video className="w-4 h-4 mr-2" />
            Video URL
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
            onClick={() => document.getElementById('pdf-upload')?.click()}
          >
            <FileText className="w-4 h-4 mr-2" />
            Upload PDF
          </Button>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0], 'pdf');
                e.target.value = '';
              }
            }}
          />

          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0], 'image');
                e.target.value = '';
              }
            }}
          />

          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
            onClick={() => setShowWebDialog(true)}
          >
            <Globe className="w-4 h-4 mr-2" />
            Web Page
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
            onClick={() => document.getElementById('audio-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Audio/Voice
          </Button>
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0], 'audio');
                e.target.value = '';
              }
            }}
          />

          <div className="pt-4 mt-4 border-t border-border">
            <h3 className="font-semibold mb-2 text-sm">Groups</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                Tone
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                Reference
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                Content
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <Canvas
            boardId={params.boardId}
            initialNodes={nodes}
            initialEdges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
          />
          {loadError && !loadingBoard && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-card/90 border border-destructive/40 text-destructive px-4 py-2 rounded-md shadow-lg backdrop-blur">
                {loadError}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - AI Assistant */}
        <div className="w-80 border-l border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold">AI Assistant</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                Select nodes on the canvas to ask questions or generate content
              </p>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => alert('AI Summarization coming soon! Select nodes on the canvas first.')}
              >
                Summarize Selected
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => alert('Key Points extraction coming soon! Select nodes on the canvas first.')}
              >
                Extract Key Points
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => alert('Content Generation coming soon! Add reference content first.')}
              >
                Generate Content
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => alert('Source Comparison coming soon! Select multiple nodes first.')}
              >
                Compare Sources
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <label className="text-sm font-medium mb-2 block">AI Model</label>
              <select className="w-full border border-border rounded-md p-2 bg-background text-sm">
                <option>GPT-4</option>
                <option>GPT-3.5 Turbo</option>
                <option>Claude 3 Opus</option>
                <option>Claude 3 Sonnet</option>
              </select>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Credits</span>
                <span className="text-sm text-muted-foreground">
                  {creditLabel}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${creditProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video URL Dialog */}
      {showVideoDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Video URL</h3>
            <Input
              placeholder="Paste YouTube, TikTok, or Vimeo URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !processing && addVideoNode()}
              className="mb-4"
              disabled={processing}
            />
            <div className="flex gap-2">
              <Button
                onClick={addVideoNode}
                className="flex-1"
                disabled={!videoUrl.trim() || processing}
              >
                {processing ? 'Processing...' : 'Add Video'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setVideoUrl('');
                  setShowVideoDialog(false);
                }}
                disabled={processing}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Web Page Dialog */}
      {showWebDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Web Page</h3>
            <Input
              placeholder="Paste article or webpage URL"
              value={webUrl}
              onChange={(e) => setWebUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !processing && addWebPageNode()}
              className="mb-4"
              disabled={processing}
            />
            <div className="flex gap-2">
              <Button
                onClick={addWebPageNode}
                className="flex-1"
                disabled={!webUrl.trim() || processing}
              >
                {processing ? 'Processing...' : 'Add Page'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setWebUrl('');
                  setShowWebDialog(false);
                }}
                disabled={processing}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
