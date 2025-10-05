'use client';

import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { NodeData } from '@/types';
import TextNode from './nodes/TextNode';
import VideoNode from './nodes/VideoNode';
import PDFNode from './nodes/PDFNode';
import ImageNode from './nodes/ImageNode';
import WebPageNode from './nodes/WebPageNode';
import AIChatNode from './nodes/AIChatNode';

const nodeTypes = {
  TEXT: TextNode,
  VIDEO: VideoNode,
  PDF: PDFNode,
  IMAGE: ImageNode,
  WEB_PAGE: WebPageNode,
  AI_CHAT: AIChatNode,
};

interface CanvasProps {
  boardId: string;
  initialNodes?: Node<NodeData>[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node<NodeData>[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
}

export default function Canvas({
  boardId,
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
}: CanvasProps) {
  const [nodes, setNodes, handleNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, handleEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  // Sync with parent when initialNodes change
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  // Sync with parent when initialEdges change
  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      setSelectedNodes(selectedNodes.map((n) => n.id));
    },
    []
  );

  React.useEffect(() => {
    onNodesChange?.(nodes);
  }, [nodes, onNodesChange]);

  React.useEffect(() => {
    onEdgesChange?.(edges);
  }, [edges, onEdgesChange]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="bg-background border border-border"
        />
        <Panel position="top-left" className="bg-card p-3 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Selected: {selectedNodes.length}
            </span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
