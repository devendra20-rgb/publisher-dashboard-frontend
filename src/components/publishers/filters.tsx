"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, Calendar } from "lucide-react";

export interface FiltersState {
  publisherName: string;
  usedBy: string;
  market: string;
  status: string;
  range: string;
  startDate: string;
  endDate: string;
}

export function PublisherFilters({
  value,
  onChange,
  people,
  markets,
  statuses,
}: {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  people: string[];
  markets: string[];
  statuses: string[];
}) {
  const dirty =
    value.publisherName ||
    value.usedBy ||
    value.market ||
    value.status ||
    value.range ||
    value.startDate ||
    value.endDate;

  // Base styles to inject into native selects for modern appearance
  const baseSelectStyles = "w-full h-11 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all appearance-none cursor-pointer";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm space-y-5">
      
      {/* SECTION LABEL (UX Enhancement) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
          Filter Records
        </h2>
        {dirty && (
          <span className="text-xs bg-amber-50 text-amber-700 font-medium px-2.5 py-1 rounded-full border border-amber-200/60 animate-fade-in">
            Active Filters Applied
          </span>
        )}
      </div>

      {/* TOP ROW: Grids & Selects */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Search Input Box */}
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <Input
            className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-slate-400 placeholder:text-slate-400 transition-all w-full text-sm"
            placeholder="Search publisher..."
            value={value.publisherName}
            onChange={(e) =>
              onChange({
                ...value,
                publisherName: e.target.value,
              })
            }
          />
        </div>

        {/* Used By Selector */}
        <div className="relative">
          <select
            className={baseSelectStyles}
            value={value.usedBy}
            onChange={(e) =>
              onChange({
                ...value,
                usedBy: e.target.value,
              })
            }
          >
            <option value="">All Delivery Persons</option>
            {people.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
        </div>

        {/* Market Selector */}
        <div className="relative">
          <select
            className={baseSelectStyles}
            value={value.market}
            onChange={(e) =>
              onChange({
                ...value,
                market: e.target.value,
              })
            }
          >
            <option value="">All Markets</option>
            {markets.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
        </div>

        {/* Status Selector */}
        <div className="relative">
          <select
            className={baseSelectStyles}
            value={value.status}
            onChange={(e) =>
              onChange({
                ...value,
                status: e.target.value,
              })
            }
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
        </div>
      </div>

      {/* DATE FILTERS & ACTION ACTIONS ROW */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 border-t border-slate-50 pt-4">

        {/* Time Range Dropdown */}
        <div className="relative min-w-[220px]">
          <select
            className={baseSelectStyles}
            value={value.range}
            onChange={(e) =>
              onChange({
                ...value,
                range: e.target.value,
              })
            }
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
        </div>

        {/* SHOW ONLY WHEN CUSTOM RANGE IS SELECTED */}
        {value.range === "custom" && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto animate-fade-in">
            <div className="relative w-full sm:w-[200px]">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
              <Input
                type="date"
                className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-slate-400 text-sm text-slate-700 w-full"
                value={value.startDate}
                onChange={(e) =>
                  onChange({
                    ...value,
                    startDate: e.target.value,
                  })
                }
              />
            </div>

            <span className="text-slate-400 text-center text-sm font-medium px-1">to</span>

            <div className="relative w-full sm:w-[200px]">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
              <Input
                type="date"
                className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-slate-400 text-sm text-slate-700 w-full"
                value={value.endDate}
                onChange={(e) =>
                  onChange({
                    ...value,
                    endDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}

        {/* CLEAR FILTERS BUTTON */}
        {dirty && (
          <Button
            variant="ghost"
            className="h-11 rounded-xl px-4 text-slate-500 hover:text-red-600 hover:bg-red-50/50 font-medium transition-all ml-auto sm:w-auto w-full inline-flex items-center justify-center gap-2 border border-dashed border-slate-200 sm:border-0"
            onClick={() =>
              onChange({
                publisherName: "",
                usedBy: "",
                market: "",
                status: "",
                range: "",
                startDate: "",
                endDate: "",
              })
            }
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}