'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Node, Edge } from 'reactflow';
import { Button } from '@/components/ui/button';
import { NodeData } from '@/types';
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
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showWebDialog, setShowWebDialog] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [webUrl, setWebUrl] = useState('');

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold">Untitled Board</h1>
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
                alert('PDF upload coming soon!');
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
                alert('Image upload coming soon!');
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
                alert('Audio upload coming soon!');
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
                <span className="text-sm text-muted-foreground">850 / 1000</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }} />
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
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (videoUrl) {
                    alert('Video processing coming soon!');
                    setVideoUrl('');
                    setShowVideoDialog(false);
                  }
                }}
                className="flex-1"
              >
                Add Video
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setVideoUrl('');
                  setShowVideoDialog(false);
                }}
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
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (webUrl) {
                    alert('Webpage scraping coming soon!');
                    setWebUrl('');
                    setShowWebDialog(false);
                  }
                }}
                className="flex-1"
              >
                Add Page
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setWebUrl('');
                  setShowWebDialog(false);
                }}
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
