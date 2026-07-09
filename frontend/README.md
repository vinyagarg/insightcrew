# InsightCrew - Multi-Agent AI Research Frontend

A premium dark-themed Next.js frontend for InsightCrew, a multi-agent AI research assistant that orchestrates autonomous agents (Planner, Retriever, Analyst, Critic) to produce comprehensive research reports.

## Features

- **Home Screen**: Centered search interface with example queries and a premium dark aesthetic
- **Live Pipeline View**: Real-time visualization of the 4-stage research pipeline with:
  - Status indicators and pulse animations for active stages
  - Expandable output previews for completed stages
  - Revision loop animation when the Critic stage triggers re-analysis
- **Report View**: Document-style research output with:
  - Citation linking (hover to see source snippets)
  - Confidence badges (high/medium/low)
  - Collapsible source lists with links
  - Session history sidebar
- **Session Management**: localStorage-based history of recent searches (last 10 sessions)

## Design

- **Dark Control-Room Aesthetic**: Inspired by Linear and Vercel dashboards
- **Color System**: Warm amber accent (#f59e0b) on dark backgrounds
- **Typography**: Inter for body text, JetBrains Mono for agent names/status
- **Responsive**: Mobile-first design that works seamlessly on all devices

## Setup

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local and set your API URL
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

```env
NEXT_PUBLIC_API_URL=<your-backend-api-url>
```

Set this to point to your InsightCrew backend API. The frontend will make requests to:
- `POST /api/research` - Start a research session
- `GET /api/research/{sessionId}/status` - Poll for pipeline status (every 2 seconds)
- `GET /api/research/{sessionId}/report` - Fetch the completed report

## API Contracts

### Start Research
```bash
POST /api/research
Content-Type: application/json

{
  "query": "What are the latest AI trends?"
}

Response:
{
  "session_id": "abc123..."
}
```

### Poll Status
```bash
GET /api/research/{sessionId}/status

Response:
{
  "status": "running" | "done" | "error",
  "stages": [
    {
      "name": "planner" | "retriever" | "analyst" | "critic",
      "status": "waiting" | "in_progress" | "revising" | "done",
      "output": <any>
    }
  ]
}
```

### Get Report
```bash
GET /api/research/{sessionId}/report

Response:
{
  "sections": [
    {
      "heading": "Section Title",
      "content": "Section content with [1] citations",
      "confidence": "high" | "medium" | "low",
      "sources": [
        {
          "id": 1,
          "title": "Source Title",
          "url": "https://example.com",
          "snippet": "Relevant excerpt from the source..."
        }
      ]
    }
  ]
}
```

## Architecture

### Pages
- `/` - Home screen with search
- `/session/[sessionId]` - Live pipeline view
- `/session/[sessionId]/report` - Report view with sidebar

### Key Components
- `SearchBar` - Input with send button
- `PipelineView` - 4-stage timeline with status
- `StageCard` - Individual stage with expandable output
- `ReportView` - Document-style report with citations
- `SessionSidebar` - History and navigation

### Hooks
- `useSessionStatus` - Polls API every 2 seconds for status updates

## Styling

- **Tailwind CSS v4**: All styling via utility classes
- **Design Tokens**: Dark theme with semantic color variables in `globals.css`
- **Animations**: Framer Motion for smooth transitions and timeline effects

## Performance

- Fully responsive on mobile/tablet/desktop
- Optimized image loading with Next.js Image component
- Client-side session history with localStorage
- Efficient polling with cleanup on unmount

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Development

### Build for Production
```bash
pnpm build
pnpm start
```

### Type Checking
```bash
pnpm tsc --noEmit
```

### Linting
```bash
pnpm lint
```

## License

MIT
