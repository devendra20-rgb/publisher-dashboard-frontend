"use client";

import {
  Search,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

interface Props {
  filters: any;

  setFilters: any;
}

const defaultFilters = {
  publisherName: "",
  pubId: "",
  market: "",
  campaignWishlist: "",
  campaignType: "",
  mmpTrackingTool: "",
};

export function PublisherDetailsFilters({
  filters,
  setFilters,
}: Props) {

  const hasFilters =
    Object.values(filters).some(
      (v) => v !== ""
    );

  return (

    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        px-6
        py-5
        shadow-sm
      "
    >

      {/* TOP LABEL */}

      <div
        className="
          mb-5
          border-b
          border-slate-100
          pb-4
        "
      >

        <h3
          className="
            text-sm
            font-semibold
            uppercase
            tracking-wide
            text-slate-700
          "
        >
          Filter Records
        </h3>

      </div>

      {/* FILTER GRID */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-3
        "
      >

        {/* SEARCH */}

        <div className="relative">

          <Search
            className="
              absolute
              left-4
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-slate-400
            "
          />

          <Input
            placeholder="Search publisher..."
            className="
              h-12
              rounded-xl
              border-slate-200
              pl-10
              text-sm
              shadow-none
              focus-visible:ring-1
            "
            value={
              filters.publisherName
            }
            onChange={(e) =>
              setFilters({
                ...filters,
                publisherName:
                  e.target.value,
              })
            }
          />

        </div>

        {/* PUB ID */}

        <Input
          placeholder="Pub ID"
          className="
            h-12
            rounded-xl
            border-slate-200
            text-sm
            shadow-none
            focus-visible:ring-1
          "
          value={filters.pubId}
          onChange={(e) =>
            setFilters({
              ...filters,
              pubId:
                e.target.value,
            })
          }
        />

        {/* MARKET */}

        <Input
          placeholder="Market"
          className="
            h-12
            rounded-xl
            border-slate-200
            text-sm
            shadow-none
            focus-visible:ring-1
          "
          value={filters.market}
          onChange={(e) =>
            setFilters({
              ...filters,
              market:
                e.target.value,
            })
          }
        />

        {/* WISHLIST */}

        <Input
          placeholder="Campaign Wishlist"
          className="
            h-12
            rounded-xl
            border-slate-200
            text-sm
            shadow-none
            focus-visible:ring-1
          "
          value={
            filters.campaignWishlist
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              campaignWishlist:
                e.target.value,
            })
          }
        />

        {/* CAMPAIGN TYPE */}

        <select
          className="
            h-12
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            text-sm
            text-slate-700
            outline-none
            shadow-none
            transition-all
            focus:ring-1
            focus:ring-slate-300
          "
          value={
            filters.campaignType
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              campaignType:
                e.target.value,
            })
          }
        >

          <option value="">
            All Campaign Types
          </option>

          <option value="App">
            App
          </option>

          <option value="Web">
            Web
          </option>

        </select>

        {/* MMP */}

        <Input
          placeholder="MMP Tracking Tool"
          className="
            h-12
            rounded-xl
            border-slate-200
            text-sm
            shadow-none
            focus-visible:ring-1
          "
          value={
            filters.mmpTrackingTool
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              mmpTrackingTool:
                e.target.value,
            })
          }
        />

      </div>

      {/* FOOTER */}

      <div
        className="
          mt-5
          flex
          items-center
          justify-end
        "
      >

        {hasFilters && (

          <Button
            variant="outline"
            className="
              h-11
              rounded-xl
              border-slate-200
              px-4
              font-medium
              shadow-none
            "
            onClick={() =>
              setFilters(
                defaultFilters
              )
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