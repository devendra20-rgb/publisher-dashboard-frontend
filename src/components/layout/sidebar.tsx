"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileSpreadsheet, X } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/publishers", label: "Publishers", icon: Users },
  { href: "/sheets", label: "Sheets", icon: FileSpreadsheet },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar Overlay Sheet Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={onClose} 
        />
      )}
      
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 flex flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand/Logo Layout Matching Global Header Alignment */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-6 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white font-bold text-sm tracking-wide shadow-sm shadow-blue-500/20">
              P
            </div>
            <span className="font-semibold text-slate-900 tracking-tight text-base">
              PubAdmin
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Core Matrix Links */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                  active 
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/15" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon 
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105",
                    active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                  )} 
                />
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}