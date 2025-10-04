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
          >
            <Video className="w-4 h-4 mr-2" />
            Video URL
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Upload PDF
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Upload Image
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
          >
            <Globe className="w-4 h-4 mr-2" />
            Web Page
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Audio/Voice
          </Button>

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
              <Button variant="outline" className="w-full justify-start" size="sm">
                Summarize Selected
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                Extract Key Points
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                Generate Content
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
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
    </div>
  );
}
