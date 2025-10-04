'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { VideoNodeData } from '@/types';
import { Video, Clock } from 'lucide-react';

export default function VideoNode({ data }: NodeProps<VideoNodeData>) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border-2 border-border rounded-lg overflow-hidden min-w-[300px] max-w-[400px] shadow-md">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      {data.thumbnailUrl && (
        <div className="relative">
          <img
            src={data.thumbnailUrl}
            alt={data.label}
            className="w-full h-40 object-cover"
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(data.duration)}
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <Video className="w-5 h-5 text-red-600 dark:text-red-300" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{data.label}</h3>
            <p className="text-xs text-muted-foreground">
              {data.platform?.toUpperCase()}
            </p>
            {data.transcription && (
              <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                Transcribed
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
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
