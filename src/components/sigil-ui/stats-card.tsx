interface StatsCardProps {
  label: string
  value: number
}

export function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-6 text-center backdrop-blur-sm">
      <div className="text-3xl font-bold text-blue-200 mb-1">{value}</div>
      <p className="text-sm text-blue-300/70">{label}</p>
    </div>
  )
}
