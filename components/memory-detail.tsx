'use client';

import { Memory } from '@/types/memory';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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
  // Handle fenced code blocks (```lang ... ```)
  content = content.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .trimEnd();
    const langLabel = lang
      ? `<div class="code-lang">${lang}</div>`
      : '';
    return `<div class="code-block">${langLabel}<pre><code>${escapedCode}</code></pre></div>`;
  });

  // Handle tables
  const tableRegex = new RegExp('^(\\|[^\\n]+\\|)\\n\\|([\\-\\|\\s:]+)\\|\\n((?:\\|[^\\n]+\\|\\n?)+)', 'gm');
  content = content.replace(tableRegex, (_match, headerRow, _separator, bodyRows) => {
    const headers = headerRow
      .split('|')
      .filter((cell: string) => cell.trim() !== '')
      .map((cell: string) => cell.trim());

    const rows = bodyRows
      .trim()
      .split('\n')
      .map((row: string) => {
        const cells = row
          .split('|')
          .filter((cell: string) => cell.trim() !== '')
          .map((cell: string) => cell.trim());
        return `<tr>${cells.map((cell: string) => `<td>${cell}</td>`).join('')}</tr>`;
      })
      .join('');

    const headerHtml = headers
      .map((h: string) => `<th>${h}</th>`)
      .join('');

    return `<div class="table-wrapper"><table><thead><tr>${headerHtml}</tr></thead><tbody>${rows}</tbody></table></div>`;
  });

  // Handle list items (before line breaks)
  content = content.replace(/^- (.*$)/gim, '<li>$1</li>');
  content = content.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  return content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br />');
}

export function MemoryDetail({ memory, open, onOpenChange }: MemoryDetailProps) {
  if (!memory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="px-10 pt-8 pb-2">
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            {getIcon(memory.type)}
            <Badge variant="secondary" className="text-xs font-normal">{getTypeLabel(memory.type)}</Badge>
            <span>{memory.dateFormatted}</span>
            <span>·</span>
            <span className="font-mono text-xs">{memory.source}</span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight mt-3">{memory.title}</DialogTitle>
        </DialogHeader>
        <div className="px-10 py-6 max-h-[60vh] overflow-y-auto overflow-x-auto">
          <div
            className="gh-prose max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(memory.content) }}
          />
          {memory.tags && memory.tags.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="flex flex-wrap gap-2">
                {memory.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
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
