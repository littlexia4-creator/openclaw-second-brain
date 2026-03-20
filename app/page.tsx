import { Suspense } from 'react';
import { loadAllMemories } from '@/lib/memories';
import { MemoryList } from '@/components/memory-list';
import { MemoryListSkeleton } from '@/components/memory-list-skeleton';

export default async function Home() {
  const allMemories = await loadAllMemories();

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
          memories={allMemories}
          allMemories={allMemories}
          counts={counts}
          initialFilter="all"
          initialSearch=""
        />
      </Suspense>
    </main>
  );
}
