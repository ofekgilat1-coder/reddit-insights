'use client'

import Link from 'next/link'
import { Cell, Label, Pie, PieChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { EmptyState } from '@/components/shared/states'
import { formatNumber, formatPercent } from '@/lib/format'
import type { TopicShare } from '@/lib/types'

export function TopicDistributionChart({ data }: { data: TopicShare[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0)
  const chartConfig = Object.fromEntries(
    data.map((d) => [d.topicId, { label: d.name, color: d.color }]),
  ) satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic distribution</CardTitle>
        <CardDescription>Share of comments by primary topic</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {total > 0 ? (
          <>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-48">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="topicId" />}
                />
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="topicId"
                  innerRadius={56}
                  outerRadius={84}
                  strokeWidth={2}
                  stroke="var(--card)"
                  paddingAngle={1}
                >
                  {data.map((d) => (
                    <Cell key={d.topicId} fill={d.color} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !('cx' in viewBox)) return null
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-semibold"
                          >
                            {formatNumber(total)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 20}
                            className="fill-muted-foreground text-xs"
                          >
                            comments
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="flex flex-col gap-2">
              {data.slice(0, 5).map((d) => (
                <li key={d.topicId}>
                  <Link
                    href={`/topics?topic=${d.topicId}`}
                    className="flex items-center gap-2 rounded-md text-sm hover:text-foreground focus-visible:outline-2"
                  >
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: d.color }}
                      aria-hidden="true"
                    />
                    <span className="flex-1 truncate text-muted-foreground">{d.name}</span>
                    <span className="font-medium tabular-nums">{formatPercent(d.share)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState
            title="No topics yet"
            description="Topics appear once comments are analyzed."
            bordered={false}
          />
        )}
      </CardContent>
    </Card>
  )
}
