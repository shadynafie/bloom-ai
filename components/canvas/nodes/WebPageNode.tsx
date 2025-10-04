'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { WebPageNodeData } from '@/types';
import { Globe } from 'lucide-react';

export default function WebPageNode({ data }: NodeProps<WebPageNodeData>) {
  return (
    <div className="bg-card border-2 border-border rounded-lg p-4 min-w-[250px] max-w-[350px] shadow-md">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-start gap-3">
        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
          <Globe className="w-5 h-5 text-green-600 dark:text-green-300" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
            {data.title || data.label}
          </h3>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline truncate block"
          >
            {new URL(data.url).hostname}
          </a>
          {data.content && (
            <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
              Extracted
            </span>
          )}
          {data.group && (
            <span className={`inline-block mt-2 ml-2 text-xs px-2 py-1 rounded-full ${
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
