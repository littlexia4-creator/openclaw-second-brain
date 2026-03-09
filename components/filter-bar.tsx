'use client';

import { FilterType } from '@/types/memory';
import { Button } from '@/components/ui/button';
import { Calendar, Brain, MessageSquare, Layers } from 'lucide-react';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    daily: number;
    longterm: number;
    conversation: number;
  };
}

const filters: { value: FilterType; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All', icon: <Layers className="h-4 w-4" /> },
  { value: 'daily', label: 'Daily', icon: <Calendar className="h-4 w-4" /> },
  { value: 'longterm', label: 'Long-term', icon: <Brain className="h-4 w-4" /> },
  { value: 'conversation', label: 'Conversations', icon: <MessageSquare className="h-4 w-4" /> },
];

export function FilterBar({ activeFilter, onFilterChange, counts }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className="gap-2"
        >
          {filter.icon}
          <span>{filter.label}</span>
          <span className="ml-1 text-xs opacity-70">({counts[filter.value]})</span>
        </Button>
      ))}
    </div>
  );
}
