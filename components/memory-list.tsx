'use client';

import { useState, useMemo } from 'react';
import { Memory, FilterType } from '@/types/memory';
import { MemoryCard } from '@/components/memory-card';
import { MemoryDetail } from '@/components/memory-detail';
import { SearchPalette } from '@/components/search-palette';
import { FilterBar } from '@/components/filter-bar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Command, Brain } from 'lucide-react';

interface MemoryListProps {
  memories: Memory[];
  allMemories: Memory[];
  counts: {
    all: number;
    daily: number;
    longterm: number;
    conversation: number;
  };
  initialFilter: FilterType;
  initialSearch: string;
}

export function MemoryList({
  allMemories,
  counts,
  initialFilter,
  initialSearch,
}: MemoryListProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>(initialFilter);
  const [search, setSearch] = useState(initialSearch);

  const filteredMemories = useMemo(() => {
    let result = allMemories;

    if (filter !== 'all') {
      result = result.filter((m) => m.type === filter);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(lowerSearch) ||
          m.content.toLowerCase().includes(lowerSearch) ||
          m.tags?.some((t) => t.toLowerCase().includes(lowerSearch))
      );
    }

    return result;
  }, [allMemories, filter, search]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleMemorySelect = (memory: Memory) => {
    setSelectedMemory(memory);
    setDetailOpen(true);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Second Brain</h1>
          </div>
          <Button
            variant="outline"
            className="gap-2 text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium">
              <Command className="h-3 w-3" />K
            </kbd>
          </Button>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="border-b bg-card/50 px-6 py-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search memories..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <FilterBar
              activeFilter={filter}
              onFilterChange={handleFilterChange}
              counts={counts}
            />
          </div>
        </div>
      </div>

      {/* Memory Grid */}
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-20">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                No memories found
              </h3>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMemories.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onClick={() => handleMemorySelect(memory)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <footer className="border-t bg-card px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>{filteredMemories.length} memories shown</span>
          <span>Total: {allMemories.length} memories</span>
        </div>
      </footer>

      {/* Dialogs */}
      <SearchPalette
        memories={allMemories}
        onSelect={handleMemorySelect}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
      <MemoryDetail
        memory={selectedMemory}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
