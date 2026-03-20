import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Memory } from '@/types/memory';

const MEMORY_DIR = path.join(process.cwd(), '..', 'memory');
const MEMORY_FILE = path.join(process.cwd(), '..', 'MEMORY.md');

export function parseDateFromContent(content: string): Date | null {
  const match = content.match(/<!--\s*Date:\s*(\d{4}-\d{2}-\d{2})\s*-->/);
  if (!match) return null;
  return new Date(match[1]);
}

export function extractTitle(content: string): string {
  const lines = content.split('\n');
  
  // Look for H1 heading
  const h1Line = lines.find(line => line.startsWith('# '));
  if (h1Line) {
    return h1Line.replace('# ', '').trim();
  }
  
  // Look for first non-empty line
  const firstLine = lines.find(line => line.trim().length > 0);
  if (firstLine) {
    return firstLine.trim().slice(0, 100);
  }
  
  return 'Untitled';
}

export function extractTags(content: string): string[] {
  const tagMatches = content.match(/#\w+/g);
  return tagMatches ? tagMatches.map(tag => tag.slice(1)) : [];
}

export async function loadDailyMemories(): Promise<Memory[]> {
  const memories: Memory[] = [];
  
  try {
    if (!fs.existsSync(MEMORY_DIR)) {
      return memories;
    }
    
    const files = fs.readdirSync(MEMORY_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    for (const file of mdFiles) {
      const filePath = path.join(MEMORY_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const date = parseDateFromContent(content);

      if (!date) continue;
      
      memories.push({
        id: `daily-${file}`,
        title: extractTitle(content),
        content,
        date,
        type: 'daily',
        source: file,
        tags: extractTags(content),
      });
    }
  } catch (error) {
    console.error('Error loading daily memories:', error);
  }
  
  return memories.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function loadLongTermMemory(): Promise<Memory[]> {
  const memories: Memory[] = [];
  
  try {
    if (!fs.existsSync(MEMORY_FILE)) {
      return memories;
    }
    
    const content = fs.readFileSync(MEMORY_FILE, 'utf-8');
    const parsed = matter(content);
    
    memories.push({
      id: 'longterm-memory',
      title: 'Long-term Memory',
      content: parsed.content,
      date: new Date(),
      type: 'longterm',
      source: 'MEMORY.md',
      tags: extractTags(parsed.content),
    });
  } catch (error) {
    console.error('Error loading long-term memory:', error);
  }
  
  return memories;
}

export async function loadAllMemories(): Promise<Memory[]> {
  const [daily, longterm] = await Promise.all([
    loadDailyMemories(),
    loadLongTermMemory(),
  ]);
  
  return [...daily, ...longterm].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function searchMemories(memories: Memory[], query: string): Memory[] {
  if (!query.trim()) return memories;
  
  const lowerQuery = query.toLowerCase();
  
  return memories.filter(memory => {
    const titleMatch = memory.title.toLowerCase().includes(lowerQuery);
    const contentMatch = memory.content.toLowerCase().includes(lowerQuery);
    const tagMatch = memory.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
    
    return titleMatch || contentMatch || tagMatch;
  });
}

export function filterMemories(
  memories: Memory[],
  type: 'all' | 'daily' | 'longterm' | 'conversation',
  dateRange?: { from?: Date; to?: Date }
): Memory[] {
  return memories.filter(memory => {
    const typeMatch = type === 'all' || memory.type === type;
    
    let dateMatch = true;
    if (dateRange?.from) {
      dateMatch = dateMatch && memory.date >= dateRange.from;
    }
    if (dateRange?.to) {
      dateMatch = dateMatch && memory.date <= dateRange.to;
    }
    
    return typeMatch && dateMatch;
  });
}
