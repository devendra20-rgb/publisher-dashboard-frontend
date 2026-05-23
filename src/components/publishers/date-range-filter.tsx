// "use client";

// import * as React from "react";

// import {
//   format,
//   subDays,
//   startOfMonth,
// } from "date-fns";

// import {
//   CalendarIcon,
// } from "lucide-react";

// import {
//   DateRange,
// } from "react-day-picker";

// import { Button } from "@/components/ui/button";

// import {
//   Calendar,
// } from "@/components/ui/calendar";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// import {
//   Select,
// } from "@/components/ui/select";

// interface Props {
//   value: {
//     range: string;
//     startDate: string;
//     endDate: string;
//   };

//   onChange: (
//     value: {
//       range: string;
//       startDate: string;
//       endDate: string;
//     }
//   ) => void;
// }

// export function DateRangeFilter({
//   value,
//   onChange,
// }: Props) {
//   const [date, setDate] =
//     React.useState<
//       DateRange | undefined
//     >({
//       from: value.startDate
//         ? new Date(
//             value.startDate
//           )
//         : undefined,

//       to: value.endDate
//         ? new Date(
//             value.endDate
//           )
//         : undefined,
//     });

//   const handlePreset = (
//     val: string
//   ) => {
//     const now = new Date();

//     if (val === "") {
//       onChange({
//         range: "",
//         startDate: "",
//         endDate: "",
//       });

//       return;
//     }

//     if (val === "last7days") {
//       onChange({
//         range: val,
//         startDate: format(
//           subDays(now, 7),
//           "yyyy-MM-dd"
//         ),
//         endDate: format(
//           now,
//           "yyyy-MM-dd"
//         ),
//       });
//     }

//     if (val === "last30days") {
//       onChange({
//         range: val,
//         startDate: format(
//           subDays(now, 30),
//           "yyyy-MM-dd"
//         ),
//         endDate: format(
//           now,
//           "yyyy-MM-dd"
//         ),
//       });
//     }

//     if (val === "thisMonth") {
//       onChange({
//         range: val,
//         startDate: format(
//           startOfMonth(now),
//           "yyyy-MM-dd"
//         ),
//         endDate: format(
//           now,
//           "yyyy-MM-dd"
//         ),
//       });
//     }

//     if (val === "custom") {
//       onChange({
//         range: "custom",
//         startDate: "",
//         endDate: "",
//       });
//     }
//   };

//   return (
//     <div className="flex gap-3 flex-wrap">

//       {/* Dropdown */}
//       <Select
//         value={value.range}
//         onChange={(e) =>
//           handlePreset(
//             e.target.value
//           )
//         }
//         className="h-11 min-w-[180px]"
//       >
//         <option value="">
//           All Time
//         </option>

//         <option value="last7days">
//           Last 7 Days
//         </option>

//         <option value="last30days">
//           Last 30 Days
//         </option>

//         <option value="thisMonth">
//           This Month
//         </option>

//         <option value="custom">
//           Custom Range
//         </option>
//       </Select>

//       {/* Calendar */}
//       {value.range ===
//         "custom" && (
//         <Popover>
//           <PopoverTrigger
//             asChild
//           >
//             <Button
//               variant="outline"
//               className="h-11 justify-start text-left font-normal min-w-[260px]"
//             >
//               <CalendarIcon className="mr-2 h-4 w-4" />

//               {date?.from ? (
//                 date.to ? (
//                   <>
//                     {format(
//                       date.from,
//                       "dd MMM yyyy"
//                     )}{" "}
//                     -{" "}
//                     {format(
//                       date.to,
//                       "dd MMM yyyy"
//                     )}
//                   </>
//                 ) : (
//                   format(
//                     date.from,
//                     "dd MMM yyyy"
//                   )
//                 )
//               ) : (
//                 "Pick a date range"
//               )}
//             </Button>
//           </PopoverTrigger>

//           <PopoverContent
//             className="w-auto p-0"
//             align="start"
//           >
//             <Calendar
//             //   initialFocus
//               mode="range"
//               defaultMonth={
//                 date?.from
//               }
//               selected={date}
//               onSelect={(range) => {
//                 setDate(range);

//                 onChange({
//                   range:
//                     "custom",

//                   startDate:
//                     range?.from
//                       ? format(
//                           range.from,
//                           "yyyy-MM-dd"
//                         )
//                       : "",

//                   endDate:
//                     range?.to
//                       ? format(
//                           range.to,
//                           "yyyy-MM-dd"
//                         )
//                       : "",
//                 });
//               }}
//               numberOfMonths={2}
//             />
//           </PopoverContent>
//         </Popover>
//       )}
//     </div>
//   );
// }