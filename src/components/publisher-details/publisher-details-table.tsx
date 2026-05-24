"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Database,
} from "lucide-react";

interface Props {
  data: any[];

  loading: boolean;
}

export function PublisherDetailsTable({
  data,
  loading,
}: Props) {

  return (

    <Card
      className="
        rounded-2xl
        border
        shadow-sm
        overflow-hidden
      "
    >

      <CardContent className="p-0">

        {loading ? (

          <div className="p-6 space-y-3">

            {Array.from({
              length: 6,
            }).map((_, i) => (

              <Skeleton
                key={i}
                className="
                  h-14
                  rounded-xl
                "
              />

            ))}

          </div>

        ) : data.length === 0 ? (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-20
              text-center
            "
          >

            <div
              className="
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-slate-100
              "
            >

              <Database
                className="
                  h-7
                  w-7
                  text-slate-400
                "
              />

            </div>

            <h3
              className="
                text-lg
                font-semibold
                text-slate-800
              "
            >
              No publisher details found
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Try changing filters or sync data again.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <Table>

              <TableHeader>

                <TableRow
                  className="
                    bg-slate-50/80
                    hover:bg-slate-50/80
                  "
                >

                  <TableHead
                    className="
                      h-12
                      font-semibold
                      text-slate-600
                    "
                  >
                    Pub ID
                  </TableHead>

                  <TableHead
                    className="
                      font-semibold
                      text-slate-600
                    "
                  >
                    Publisher
                  </TableHead>

                  <TableHead
                    className="
                      font-semibold
                      text-slate-600
                    "
                  >
                    Market
                  </TableHead>

                  <TableHead
                    className="
                      font-semibold
                      text-slate-600
                    "
                  >
                    Campaign Wishlist
                  </TableHead>

                  <TableHead
                    className="
                      font-semibold
                      text-slate-600
                    "
                  >
                    Campaign Type
                  </TableHead>

                  <TableHead
                    className="
                      font-semibold
                      text-slate-600
                    "
                  >
                    MMP / Tracking
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {data.map((item) => (

                  <TableRow
                    key={item._id}
                    className="
                      hover:bg-slate-50/70
                      transition-colors
                    "
                  >

                    {/* PUB ID */}

                    <TableCell
                      className="
                        font-medium
                        text-slate-700
                      "
                    >

                      <Badge
                        variant="outline"
                        className="
                          rounded-lg
                          px-2.5
                          py-1
                          text-xs
                          font-semibold
                        "
                      >
                        {item.pubId}
                      </Badge>

                    </TableCell>

                    {/* Publisher */}

                    <TableCell
                      className="
                        font-semibold
                        text-slate-900
                      "
                    >
                      {item.publisherName}
                    </TableCell>

                    {/* Market */}

                    <TableCell
                      className="
                        text-slate-700
                      "
                    >
                      {item.market}
                    </TableCell>

                    {/* Wishlist */}

                    <TableCell
                      className="
                        text-slate-700
                      "
                    >
                      {item.campaignWishlist}
                    </TableCell>

                    {/* Campaign Type */}

                    <TableCell>

                      <Badge
                        className={`
                          rounded-lg
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          ${
                            item.campaignType ===
                            "App"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                              : "bg-violet-100 text-violet-700 hover:bg-violet-100"
                          }
                        `}
                      >

                        {item.campaignType}

                      </Badge>

                    </TableCell>

                    {/* MMP */}

                    <TableCell>

                      <Badge
                        variant="secondary"
                        className="
                          rounded-lg
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                        "
                      >

                        {item.mmpTrackingTool}

                      </Badge>

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </div>

        )}

      </CardContent>

    </Card>
  );
}