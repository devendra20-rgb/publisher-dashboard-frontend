import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MonthlyChart({ data }: { data: { month: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <Card>
      <CardHeader><CardTitle>Monthly Onboarding</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-end gap-3 h-56">
          {data.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs text-muted-foreground">{d.count}</div>
              <div className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary" style={{ height: `${(d.count / max) * 100}%` }} />
              <div className="text-xs font-medium">{d.month}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
