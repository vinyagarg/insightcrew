# InsightCrew Frontend - Setup Guide

This is a Next.js 16 frontend for the InsightCrew multi-agent AI research assistant. It provides a premium dark-themed UI with real-time pipeline visualization and comprehensive research report generation.

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure API URL

Copy the environment template and update with your backend API URL:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Replace `http://localhost:8000` with your actual InsightCrew backend URL.

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Overview

### Home Screen (`/`)
- Centered search interface for research queries
- Example query suggestions
- Grid background with subtle animations
- Mobile-responsive design

### Live Pipeline (`/session/[sessionId]`)
- Real-time visualization of 4-stage research pipeline:
  - **Planner** (📋): Breaks down research questions
  - **Retriever** (🔍): Gathers relevant information
  - **Analyst** (📊): Synthesizes findings
  - **Critic** (✓): Validates and refines results
- Status indicators with pulse animations
- Expandable output previews for each stage
- Revision loop animation when Critic triggers re-analysis
- Auto-navigates to report view when complete

### Report View (`/session/[sessionId]/report`)
- Document-style research output
- Citation linking with hover previews
- Confidence badges (high/medium/low)
- Expandable source lists
- Session history sidebar (last 10 searches)
- Responsive layout for all screen sizes

## API Integration

The frontend expects your backend to provide these endpoints:

### POST /api/research
Start a new research session.

**Request:**
```json
{
  "query": "What are the latest AI trends?"
}
```

**Response:**
```json
{
  "session_id": "unique-session-id"
}
```

### GET /api/research/{sessionId}/status
Poll for pipeline progress (called every 2 seconds).

**Response:**
```json
{
  "status": "running" | "done" | "error",
  "stages": [
    {
      "name": "planner" | "retriever" | "analyst" | "critic",
      "status": "waiting" | "in_progress" | "revising" | "done",
      "output": null | "string" | object
    }
  ]
}
```

### GET /api/research/{sessionId}/report
Fetch the completed research report.

**Response:**
```json
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
          "snippet": "Relevant excerpt from source..."
        }
      ]
    }
  ]
}
```

## Testing

### View Test Page
Visit [http://localhost:3000/test](http://localhost:3000/test) to see mock pipeline and report views without a backend.

### Build for Production
```bash
pnpm build
pnpm start
```

### Run Linter
```bash
pnpm lint
```

## Architecture

### Pages
- `app/page.tsx` - Home screen
- `app/session/[sessionId]/page.tsx` - Pipeline view
- `app/session/[sessionId]/report/page.tsx` - Report view
- `app/test/page.tsx` - Test/demo page

### Components
- `components/search-bar.tsx` - Search input with send button
- `components/logo.tsx` - Brand logo
- `components/pipeline-view.tsx` - 4-stage timeline
- `components/stage-card.tsx` - Individual stage card with animations
- `components/report-view.tsx` - Document-style report
- `components/source-popover.tsx` - Citation preview tooltip
- `components/session-sidebar.tsx` - History and navigation

### Hooks
- `hooks/use-session-status.ts` - Polls API for pipeline status

## Styling

- **Tailwind CSS v4**: All styling via utility classes
- **Dark Theme**: Default dark mode with warm amber accent (#f59e0b)
- **Design Tokens**: Semantic colors defined in `globals.css`
- **Fonts**: 
  - Body: Inter (sans-serif)
  - Monospace: JetBrains Mono (for agent names/status)
- **Animations**: Framer Motion for smooth transitions

## Performance Tips

1. **API Polling**: Status polls every 2 seconds. Adjust in `hooks/use-session-status.ts` if needed.
2. **Session History**: Uses localStorage for recent sessions (last 10). No backend required.
3. **Images**: Optimized with Next.js Image component where applicable.
4. **Code Splitting**: Dynamic imports for heavy components.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### "API URL not configured" error
- Ensure `NEXT_PUBLIC_API_URL` is set in `.env.local`
- The variable must start with `NEXT_PUBLIC_` to be available in the browser

### Session not loading
- Check that your backend API is running at the configured URL
- Verify the API returns the correct response format
- Check browser console for error messages

### Citations not showing
- Ensure the report content includes citation markers like `[1]`, `[2]`
- Each citation must have a matching source with the same ID

### Styling issues
- Clear `.next` cache: `rm -rf .next`
- Rebuild: `pnpm build`
- Ensure Tailwind CSS v4 is installed

## Development Workflow

1. Make changes to components
2. Hot Module Replacement (HMR) updates the preview automatically
3. For env var changes, restart the dev server
4. Test on mobile with viewport resizing: `agent-browser set viewport 375 667`

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repo to Vercel project
3. Add `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
CMD ["pnpm", "start"]
```

### Static Export
Not applicable - this app requires dynamic rendering for session pages.

## License

MIT
