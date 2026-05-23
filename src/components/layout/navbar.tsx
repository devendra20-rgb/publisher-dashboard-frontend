"use client";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu}><Menu className="h-5 w-5" /></Button>
      <div className="hidden md:flex items-center flex-1 max-w-md gap-2 rounded-md border bg-muted/40 px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input placeholder="Quick search…" className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-medium">A</div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium leading-none">Admin</div>
            <div className="text-xs text-muted-foreground">admin@company.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}
