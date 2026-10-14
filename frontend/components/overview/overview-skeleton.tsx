import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function ChartCardSkeleton({ className, height = 'h-64' }: { className?: string; height?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <Skeleton className={`${height} w-full`} />
      </CardContent>
    </Card>
  )
}

export function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading overview">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} size="sm">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-32" />
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCardSkeleton className="lg:col-span-2" />
        <ChartCardSkeleton />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCardSkeleton height="h-72" />
        <ChartCardSkeleton height="h-72" />
      </div>
    </div>
  )
}
