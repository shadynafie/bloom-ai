'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ImageNodeData } from '@/types';
import { Image as ImageIcon } from 'lucide-react';

export default function ImageNode({ data }: NodeProps<ImageNodeData>) {
  return (
    <div className="bg-card border-2 border-border rounded-lg overflow-hidden min-w-[250px] max-w-[350px] shadow-md">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="relative">
        <img
          src={data.url}
          alt={data.label}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-300" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 truncate">{data.label}</h3>
            {data.width && data.height && (
              <p className="text-xs text-muted-foreground">
                {data.width} × {data.height}
              </p>
            )}
            {data.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {data.description}
              </p>
            )}
            {data.extractedText && (
              <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                Text Extracted
              </span>
            )}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
