'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { AIChatNodeData } from '@/types';
import { Bot } from 'lucide-react';

export default function AIChatNode({ data }: NodeProps<AIChatNodeData>) {
  const lastMessage = data.messages[data.messages.length - 1];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-4 min-w-[300px] max-w-[400px] shadow-md">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-start gap-3">
        <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-lg">
          <Bot className="w-5 h-5 text-purple-600 dark:text-purple-300" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1">{data.label}</h3>
          <p className="text-xs text-muted-foreground mb-2">
            {data.model.toUpperCase()}
          </p>
          {lastMessage && (
            <div className="bg-white dark:bg-gray-800 rounded p-2 text-xs">
              <p className="font-medium text-muted-foreground mb-1">
                {lastMessage.role === 'user' ? 'You' : 'AI'}:
              </p>
              <p className="line-clamp-3">{lastMessage.content}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {data.messages.length} messages
          </p>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
