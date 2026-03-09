import { Suspense } from 'react';
import { loadAllMemories, filterMemories } from '@/lib/memories';
import { MemoryList } from '@/components/memory-list';
import { MemoryListSkeleton } from '@/components/memory-list-skeleton';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const allMemories = await loadAllMemories();
  
  const filter = (searchParams.filter as 'all' | 'daily' | 'longterm' | 'conversation') || 'all';
  const search = (searchParams.search as string) || '';
  
  let filteredMemories = filterMemories(allMemories, filter);
  
  if (search) {
    const lowerSearch = search.toLowerCase();
    filteredMemories = filteredMemories.filter(
      (m) =>
        m.title.toLowerCase().includes(lowerSearch) ||
        m.content.toLowerCase().includes(lowerSearch) ||
        m.tags?.some((t) => t.toLowerCase().includes(lowerSearch))
    );
  }

  const counts = {
    all: allMemories.length,
    daily: allMemories.filter((m) => m.type === 'daily').length,
    longterm: allMemories.filter((m) => m.type === 'longterm').length,
    conversation: allMemories.filter((m) => m.type === 'conversation').length,
  };

  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<MemoryListSkeleton />}>
        <MemoryList 
          memories={filteredMemories} 
          allMemories={allMemories}
          counts={counts}
          initialFilter={filter}
          initialSearch={search}
        />
      </Suspense>
    </main>
  );
}
