'use client';

import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Memory } from '@/types/memory';
import { FileText, Brain, MessageSquare, Calendar } from 'lucide-react';

interface SearchPaletteProps {
  memories: Memory[];
  onSelect: (memory: Memory) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function SearchPalette({ memories, onSelect, open, onOpenChange }: SearchPaletteProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onOpenChange]);

  const filteredMemories = search.trim()
    ? memories.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.content.toLowerCase().includes(search.toLowerCase()) ||
          m.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : memories;

  const groupedMemories = filteredMemories.reduce((acc, memory) => {
    const group = memory.type === 'daily' 
      ? 'Daily Notes' 
      : memory.type === 'longterm' 
      ? 'Long-term Memory' 
      : 'Conversations';
    
    if (!acc[group]) acc[group] = [];
    acc[group].push(memory);
    return acc;
  }, {} as Record<string, Memory[]>);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search memories..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No memories found.</CommandEmpty>
        {Object.entries(groupedMemories).map(([group, items]) => (
          <CommandGroup key={group} heading={group}>
            {items.slice(0, 10).map((memory) => (
              <CommandItem
                key={memory.id}
                onSelect={() => {
                  onSelect(memory);
                  onOpenChange(false);
                }}
                className="flex items-center gap-3 cursor-pointer"
              >
                {getIcon(memory.type)}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{memory.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {memory.dateFormatted}
                    {memory.tags && memory.tags.length > 0 && (
                      <span className="ml-2">· {memory.tags.slice(0, 3).join(', ')}</span>
                    )}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
