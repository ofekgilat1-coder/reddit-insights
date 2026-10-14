'use client'

import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { EmptyState } from '@/components/shared/states'
import type { ActivityPoint } from '@/lib/types'

const chartConfig = {
  comments: { label: 'Comments', color: 'var(--chart-1)' },
  karma: { label: 'Karma', color: 'var(--chart-3)' },
} satisfies ChartConfig

type Series = keyof typeof chartConfig

export function ActivityChart({
  data,
  className,
}: {
  data: ActivityPoint[]
  className?: string
}) {
  const [series, setSeries] = useState<Series>('comments')
  const hasData = data.some((d) => d.comments > 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Activity over time</CardTitle>
        <CardDescription>
          {series === 'comments' ? 'Comments posted per period' : 'Karma earned per period'}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            variant="outline"
            size="sm"
            value={[series]}
            onValueChange={(value) => {
              const next = value[0] as Series | undefined
              if (next) setSeries(next)
            }}
            aria-label="Chart series"
          >
            <ToggleGroupItem value="comments">Comments</ToggleGroupItem>
            <ToggleGroupItem value="karma">Karma</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="fill-activity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${series})`} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={`var(--color-${series})`} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Area
                dataKey={series}
                type="monotone"
                stroke={`var(--color-${series})`}
                strokeWidth={2}
                fill="url(#fill-activity)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <EmptyState
            title="No activity in this range"
            description="Try a longer date range to see your history."
            bordered={false}
          />
        )}
      </CardContent>
    </Card>
  )
}
