export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
export const API_SECRET_KEY = process.env.NEXT_PUBLIC_API_SECRET_KEY || ''

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'X-API-Key': API_SECRET_KEY,
}

export const STORAGE_KEYS = {
  USER_NAME: 'insightcrew_user_name',
  RESEARCH_HISTORY: 'insightcrew_research_history',
}

export const EXAMPLE_QUERIES = [
  'How does photosynthesis work and what is its role in climate?',
  'What are the latest breakthroughs in quantum computing?',
  'How is artificial intelligence transforming healthcare?',
  'What are the environmental impacts of plastic production?',
]

export const POLLING_INTERVAL = 2000
export const POLLING_TIMEOUT = 60000

export const STAGE_LABELS = {
  planner: 'Planning',
  retriever: 'Researching',
  analyst: 'Analyzing',
  critic: 'Reviewing',
}

export const CONFIDENCE_COLORS = {
  high: {
    bg: 'bg-green-500/10',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-500/20',
  },
  medium: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-500/20',
  },
  low: {
    bg: 'bg-red-500/10',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-500/20',
  },
}