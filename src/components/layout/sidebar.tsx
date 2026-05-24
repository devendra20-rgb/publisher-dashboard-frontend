"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Database,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────

const nav = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    href: "/publishers",
    label: "Publishers",
    icon: Users,
  },

  {
    href: "/publisher-details",
    label: "Publisher Details",
    icon: Database,
  },

  {
    href: "/sheets",
    label: "Sheets",
    icon: FileSpreadsheet,
  },
];

// ─────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;

  onClose: () => void;
}) {
  const pathname =
    usePathname();

  return (
    <>
      {/* Mobile Overlay */}

      {open && (
        <div
          className="
            fixed inset-0 z-30
            bg-black/40
            backdrop-blur-sm
            lg:hidden
            transition-opacity
          "
          onClick={
            onClose
          }
        />
      )}

      {/* Sidebar */}

      <aside
        className={cn(
          `
            fixed inset-y-0 left-0 z-40
            w-72
            border-r border-white/10
            bg-zinc-950/95
            backdrop-blur-xl
            transition-transform duration-300 ease-in-out
            lg:translate-x-0 lg:static lg:z-0
            flex flex-col
            shadow-2xl
          `,

          open
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        {/* Header */}

        <div
          className="
            flex h-16 items-center justify-between
            border-b border-white/10
            px-6
            shrink-0
          "
        >
          {/* Brand */}

          <div className="flex items-center gap-3">
            <div
              className="
                grid h-10 w-10 place-items-center
                rounded-xl
                bg-gradient-to-br
                from-blue-500
                to-violet-600
                text-white
                font-bold
                text-sm
                shadow-lg shadow-blue-500/20
              "
            >
              P
            </div>

            <div>
              <p className="font-semibold text-white tracking-tight">
                PubAdmin
              </p>

              <p className="text-xs text-zinc-400">
                Analytics Dashboard
              </p>
            </div>
          </div>

          {/* Mobile Close */}

          <button
            onClick={
              onClose
            }
            className="
              lg:hidden
              rounded-lg
              p-2
              text-zinc-400
              hover:bg-white/5
              hover:text-white
              transition
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {nav.map(
            (item) => {
              const active =
                pathname ===
                  item.href ||
                (item.href !==
                  "/" &&
                  pathname.startsWith(
                    item.href
                  ));

              const Icon =
                item.icon;

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  onClick={
                    onClose
                  }
                  className={cn(
                    `
                      group relative flex items-center
                      gap-3 rounded-xl
                      px-4 py-3
                      text-sm font-medium
                      transition-all duration-200
                    `,

                    active
                      ? `
                          bg-gradient-to-r
                          from-blue-600
                          to-violet-600
                          text-white
                          shadow-lg
                          shadow-blue-500/20
                        `
                      : `
                          text-zinc-400
                          hover:bg-white/5
                          hover:text-white
                        `
                  )}
                >
                  {/* Active Indicator */}

                  {active && (
                    <div
                      className="
                        absolute left-0 top-1/2
                        h-8 w-1
                        -translate-y-1/2
                        rounded-r-full
                        bg-white
                      "
                    />
                  )}

                  {/* Icon */}

                  <Icon
                    className={cn(
                      `
                        h-4 w-4 shrink-0
                        transition-transform duration-200
                        group-hover:scale-110
                      `,

                      active
                        ? "text-white"
                        : "text-zinc-500 group-hover:text-white"
                    )}
                  />

                  {/* Label */}

                  <span className="tracking-wide">
                    {
                      item.label
                    }
                  </span>
                </Link>
              );
            }
          )}
        </nav>

        {/* Footer */}

        <div
          className="
            border-t border-white/10
            p-4
          "
        >
          <div
            className="
              rounded-xl
              bg-white/5
              p-4
            "
          >
            <p className="text-sm font-medium text-white">
              Publisher CRM
            </p>

            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              Manage onboarding,
              sheets, analytics &
              publisher details
              from one place.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}