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

  // Handle tables first (before processing other elements)
  // Match markdown tables: header row, separator row, data rows
  // Using RegExp constructor to avoid issues with literal newlines
  const tableRegex = new RegExp('^(\\|[^\\n]+\\|)\\n\\|([\\-\\|\\s]+)\\|\\n((?:\\|[^\\n]+\\|\\n?)+)', 'gm');
  content = content.replace(tableRegex, (match, headerRow, separator, bodyRows) => {
    // Parse header cells
    const headers = headerRow
      .split('|')
      .filter((cell: string) => cell.trim() !== '')
      .map((cell: string) => cell.trim());

    // Parse body rows
    const rows = bodyRows
      .trim()
      .split('\n')
      .map((row: string) => {
        const cells = row
          .split('|')
          .filter((cell: string) => cell.trim() !== '')
          .map((cell: string) => cell.trim());
        return `<tr>${cells.map((cell: string) => `<td class="border border-border px-3 py-2">${cell}</td>`).join('')}</tr>`;
      })
      .join('');

    const headerHtml = headers
      .map((h: string) => `<th class="border border-border px-3 py-2 bg-muted font-semibold text-left">${h}</th>`)
      .join('');

    return `<table class="border-collapse border border-border w-full mb-4"><thead><tr>${headerHtml}</tr></thead><tbody>${rows}</tbody></table>`;
  });

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
              {memory.dateFormatted}
            </span>
            <span className="text-sm text-muted-foreground">· {memory.source}</span>
          </div>
        </DialogHeader>
        <Separator />
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto overflow-x-auto">
          <div
            className="prose prose-sm dark:prose-invert max-w-none whitespace-nowrap"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
