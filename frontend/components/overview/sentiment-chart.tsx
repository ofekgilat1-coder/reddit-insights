'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { EmptyState } from '@/components/shared/states'
import { formatPercent } from '@/lib/format'
import type { SentimentBreakdown, SentimentPoint } from '@/lib/types'

const chartConfig = {
  positive: { label: 'Positive', color: 'var(--success)' },
  neutral: { label: 'Neutral', color: 'var(--chart-5)' },
  negative: { label: 'Negative', color: 'var(--destructive)' },
} satisfies ChartConfig

export function SentimentChart({
  data,
  totals,
}: {
  data: SentimentPoint[]
  totals: SentimentBreakdown
}) {
  const sum = totals.positive + totals.neutral + totals.negative

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment trend</CardTitle>
        <CardDescription>
          {sum > 0
            ? `${formatPercent(totals.positive / sum)} positive · ${formatPercent(totals.negative / sum)} negative overall`
            : 'Tone of your comments over time'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sum > 0 ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
            <BarChart data={data} margin={{ left: 0, right: 0, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="negative" stackId="s" fill="var(--color-negative)" />
              <Bar dataKey="neutral" stackId="s" fill="var(--color-neutral)" />
              <Bar dataKey="positive" stackId="s" fill="var(--color-positive)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <EmptyState
            title="No sentiment data"
            description="Sentiment appears once comments are analyzed."
            bordered={false}
          />
        )}
      </CardContent>
    </Card>
  )
}
