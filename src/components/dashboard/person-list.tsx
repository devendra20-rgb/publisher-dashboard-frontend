import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PersonList({ data }: { data: { name: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  return (
    <Card>
      <CardHeader><CardTitle>Delivery Person Performance</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {data.map((d) => {
          const pct = Math.round((d.count / total) * 100);
          return (
            <div key={d.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary font-medium">{d.name[0]}</div>
                  <div>
                    <div className="text-sm font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.count} publishers</div>
                  </div>
                </div>
                <Badge variant="secondary">{pct}%</Badge>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
