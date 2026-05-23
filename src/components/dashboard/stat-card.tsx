import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ title, value, icon: Icon, hint, accent = "primary" }: {
  title: string; value: string | number; icon: LucideIcon; hint?: string;
  accent?: "primary" | "green" | "amber" | "violet";
}) {
  const colors: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
          <div className={cn("rounded-lg p-3", colors[accent])}><Icon className="h-5 w-5" /></div>
        </div>
      </CardContent>
    </Card>
  );
}
