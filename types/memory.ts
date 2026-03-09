export interface Memory {
  id: string;
  title: string;
  content: string;
  date: Date;
  type: 'daily' | 'longterm' | 'conversation';
  source: string;
  tags?: string[];
}

export interface SearchResult {
  memory: Memory;
  matches: {
    field: 'title' | 'content';
    snippet: string;
    indices: [number, number][];
  }[];
}

export type FilterType = 'all' | 'daily' | 'longterm' | 'conversation';

export interface DateRange {
  from?: Date;
  to?: Date;
}
