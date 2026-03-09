'use client';

import { Memory } from '@/types/memory';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, Brain, MessageSquare, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface MemoryDetailProps {
  memory: Memory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getIcon(type: Memory['type']) {
  switch (type) {
    case 'daily':
      return <Calendar className="h-5 w-5" />;
    case 'longterm':
      return <Brain className="h-5 w-5" />;
    case 'conversation':
      return <MessageSquare className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
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

function formatContent(content: string): string {
  // Simple markdown-like formatting
  return content
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\n/g, '<br />');
}

export function MemoryDetail({ memory, open, onOpenChange }: MemoryDetailProps) {
  if (!memory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            {getIcon(memory.type)}
            <DialogTitle className="text-xl">{memory.title}</DialogTitle>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="secondary">{getTypeLabel(memory.type)}</Badge>
            <span className="text-sm text-muted-foreground">
              {format(memory.date, 'MMMM d, yyyy')}
            </span>
            <span className="text-sm text-muted-foreground">· {memory.source}</span>
          </div>
        </DialogHeader>
        <Separator />
        <ScrollArea className="px-6 py-4 max-h-[60vh]">
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(memory.content) }}
          />
          {memory.tags && memory.tags.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-2">
                {memory.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
