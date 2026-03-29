'use client';

import { Memory } from '@/types/memory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Brain, MessageSquare, FileText } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
}

function getIcon(type: Memory['type']) {
  switch (type) {
    case 'daily':
      return <Calendar className="h-4 w-4" />;
    case 'longterm':
      return <Brain className="h-4 w-4" />;
    case 'conversation':
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

function getTypeLabel(type: Memory['type']) {
  switch (type) {
    case 'daily':
      return 'Daily Note';
    case 'longterm':
      return 'Long-term Memory';
    case 'conversation':
      return 'Conversation';
    default:
      return 'Note';
  }
}

function getTypeColor(type: Memory['type']) {
  switch (type) {
    case 'daily':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'longterm':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'conversation':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
}

export function MemoryCard({ memory, onClick }: MemoryCardProps) {
  const preview = memory.content.slice(0, 200).replace(/[#*`]/g, '');

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {getIcon(memory.type)}
            <CardTitle className="text-base font-semibold truncate">
              {memory.title}
            </CardTitle>
          </div>
          <Badge variant="secondary" className={`shrink-0 text-xs ${getTypeColor(memory.type)}`}>
            {getTypeLabel(memory.type)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {memory.dateFormatted} · {memory.source}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {preview}
        </p>
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {memory.tags.slice(0, 5).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
