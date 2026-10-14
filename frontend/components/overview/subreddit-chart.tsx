'use client'

import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { EmptyState } from '@/components/shared/states'
import type { CountPoint } from '@/lib/types'

const chartConfig = {
  count: { label: 'Comments', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function SubredditChart({ data }: { data: CountPoint[] }) {
  const rows = data.slice(0, 8).map((d) => ({ ...d, name: `r/${d.label}` }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most active subreddits</CardTitle>
        <CardDescription>Where you comment the most</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length > 0 ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
            <BarChart data={rows} layout="vertical" margin={{ left: 0, right: 40 }}>
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={128}
                tick={{ fontSize: 12 }}
              />
              <XAxis type="number" dataKey="count" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} barSize={18}>
                <LabelList
                  dataKey="count"
                  position="right"
                  offset={8}
                  className="fill-muted-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <EmptyState
            title="No subreddits"
            description="No comments were found in this date range."
            bordered={false}
          />
        )}
      </CardContent>
    </Card>
  )
}
