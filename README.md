# Second Brain

A personal knowledge base built with Next.js to review all your notes, conversations, and memories.

## Features

- **Searchable Memory List**: Browse all your daily notes and long-term memories
- **Global Search (Cmd+K)**: Quick command palette to search across everything
- **Filtering**: Filter by type (Daily, Long-term, Conversations) and date
- **Clean, Minimal UI**: Modern interface with dark/light mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Data Structure

The app reads from your OpenClaw workspace:

## Usage

1. **Browse Memories**: View all your notes in a clean grid layout
2. **Search**: Use the search bar or press `Cmd+K` for quick search
3. **Filter**: Click filter buttons to show only specific types
4. **View Details**: Click any memory card to see the full content

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- date-fns for date formatting
- gray-matter for markdown parsing