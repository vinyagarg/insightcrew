import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'

interface StageIconProps {
  stageName: 'planner' | 'retriever' | 'analyst' | 'critic'
  status: 'waiting' | 'in_progress' | 'revising' | 'done'
  size?: number
}

export default function StageIcon({ stageName, status, size = 24 }: StageIconProps) {
  const getIcon = () => {
    if (status === 'done') {
      return <CheckCircle2 size={size} className="text-green-500" />
    }
    if (status === 'in_progress' || status === 'revising') {
      return <Circle size={size} className="text-accent animate-pulse" />
    }
    if (status === 'waiting') {
      return <Circle size={size} className="text-muted-foreground" strokeWidth={1} />
    }
    return <AlertCircle size={size} className="text-destructive" />
  }

  return (
    <div className="flex items-center justify-center">
      {getIcon()}
    </div>
  )
}
