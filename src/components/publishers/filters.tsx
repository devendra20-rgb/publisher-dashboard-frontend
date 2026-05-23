"use client";

import { Input } from "@/components/ui/input";

import { Select } from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import {
  Search,
  X,
} from "lucide-react";

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

  onChange: (
    v: FiltersState
  ) => void;

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

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">

      {/* TOP ROW */}
      <div className="grid gap-3 lg:grid-cols-4">

        {/* Search */}
        <div className="relative lg:col-span-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            className="pl-9 h-11 rounded-xl"
            placeholder="Search publisher..."
            value={value.publisherName}
            onChange={(e) =>
              onChange({
                ...value,
                publisherName:
                  e.target.value,
              })
            }
          />
        </div>

        {/* Used By */}
        <Select
          className="h-11 rounded-xl"
          value={value.usedBy}
          onChange={(e) =>
            onChange({
              ...value,
              usedBy:
                e.target.value,
            })
          }
        >
          <option value="">
            All Delivery Persons
          </option>

          {people.map((p) => (
            <option
              key={p}
              value={p}
            >
              {p}
            </option>
          ))}
        </Select>

        {/* Market */}
        <Select
          className="h-11 rounded-xl"
          value={value.market}
          onChange={(e) =>
            onChange({
              ...value,
              market:
                e.target.value,
            })
          }
        >
          <option value="">
            All Markets
          </option>

          {markets.map((m) => (
            <option
              key={m}
              value={m}
            >
              {m}
            </option>
          ))}
        </Select>

        {/* Status */}
        <Select
          className="h-11 rounded-xl"
          value={value.status}
          onChange={(e) =>
            onChange({
              ...value,
              status:
                e.target.value,
            })
          }
        >
          <option value="">
            All Statuses
          </option>

          {statuses.map((s) => (
            <option
              key={s}
              value={s}
            >
              {s}
            </option>
          ))}
        </Select>
      </div>

      {/* DATE FILTERS */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Range */}
        <Select
          className="w-[220px] h-11 rounded-xl"
          value={value.range}
          onChange={(e) =>
            onChange({
              ...value,
              range:
                e.target.value,
            })
          }
        >
          <option value="">
            All Time
          </option>

          <option value="today">
            Today
          </option>

          <option value="last7days">
            Last 7 Days
          </option>

          <option value="last30days">
            Last 30 Days
          </option>

          <option value="thisMonth">
            This Month
          </option>

          <option value="custom">
            Custom Range
          </option>
        </Select>

        {/* SHOW ONLY WHEN CUSTOM */}
        {value.range ===
          "custom" && (
          <>
            <Input
              type="date"
              className="w-[200px] h-11 rounded-xl"
              value={
                value.startDate
              }
              onChange={(e) =>
                onChange({
                  ...value,
                  startDate:
                    e.target
                      .value,
                })
              }
            />

            <Input
              type="date"
              className="w-[200px] h-11 rounded-xl"
              value={
                value.endDate
              }
              onChange={(e) =>
                onChange({
                  ...value,
                  endDate:
                    e.target
                      .value,
                })
              }
            />
          </>
        )}

        {/* CLEAR */}
        {dirty && (
          <Button
            variant="outline"
            className="h-11 rounded-xl"
            onClick={() =>
              onChange({
                publisherName:
                  "",

                usedBy: "",

                market: "",

                status: "",

                range: "",

                startDate:
                  "",

                endDate: "",
              })
            }
          >
            <X className="mr-2 h-4 w-4" />

            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}