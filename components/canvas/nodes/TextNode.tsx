'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { TextNodeData } from '@/types';
import { FileText } from 'lucide-react';

export default function TextNode({ data }: NodeProps<TextNodeData>) {
  return (
    <div className="bg-card border-2 border-border rounded-lg p-4 min-w-[250px] max-w-[400px] shadow-md">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1 truncate">{data.label}</h3>
          <p className="text-xs text-muted-foreground line-clamp-3">
            {data.content}
          </p>
          {data.group && (
            <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
              data.group === 'tone' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
              data.group === 'reference' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
              'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
            }`}>
              {data.group}
            </span>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
