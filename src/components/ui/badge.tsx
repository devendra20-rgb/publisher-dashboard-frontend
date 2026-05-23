import * as React from "react";
import { cn } from "@/lib/utils";
export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "outline" | "success" | "warning" | "destructive" | "secondary" }) {
  const styles: Record<string, string> = {
    default: "bg-primary/10 text-primary",
    outline: "border border-input text-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    destructive: "bg-red-100 text-red-700",
  };
  return <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", styles[variant], className)} {...props} />;
}
