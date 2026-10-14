'use client'

import { Area, AreaChart } from 'recharts'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import type { CountPoint } from '@/lib/types'

export function Sparkline({
  data,
  color,
  id,
}: {
  data: CountPoint[]
  color: string
  id: string
}) {
  const config = { count: { label: 'Comments', color } } satisfies ChartConfig
  const gradientId = `spark-${id}`

  return (
    <ChartContainer config={config} className="aspect-auto h-10 w-full" aria-hidden="true">
      <AreaChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-count)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-count)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="count"
          type="monotone"
          stroke="var(--color-count)"
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
