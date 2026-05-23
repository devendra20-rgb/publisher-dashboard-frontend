import type { Sheet, Publisher } from "@/types";

export const dummySheets: Sheet[] = [
  { _id: "s1", sheetName: "Sagar Sheet", sheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms", usedBy: "Sagar", range: "Sheet1!A:G", active: true, createdAt: "2026-05-01T10:00:00Z", updatedAt: "2026-05-15T10:00:00Z" },
  { _id: "s2", sheetName: "Rahul Sheet", sheetId: "2CyjNWt1YSB6oGNeLwCeCAkhnVVrqumct85PhWF3vqnt", usedBy: "Rahul", range: "Sheet1!A:G", active: true, createdAt: "2026-04-22T10:00:00Z", updatedAt: "2026-05-18T10:00:00Z" },
  { _id: "s3", sheetName: "Aman Sheet", sheetId: "3DzkOXu2ZTC7pHOfMxDfDBlioWWsrvndu96QiXG4wrou", usedBy: "Aman", range: "Sheet1!A:G", active: false, createdAt: "2026-03-10T10:00:00Z", updatedAt: "2026-05-10T10:00:00Z" },
];

const markets = ["India", "US", "UK", "UAE", "Singapore"];
const statuses = ["Active", "Pending", "Onboarded", "Rejected"];
const people = ["Sagar", "Rahul", "Aman"];
const sheetIds = dummySheets.map((s) => s.sheetId);

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }
function randomDate() {
  const m = Math.floor(Math.random() * 6) + 1;
  const d = Math.floor(Math.random() * 28) + 1;
  return `${pad(d)}/${pad(m)}/2026`;
}

export const dummyPublishers: Publisher[] = Array.from({ length: 86 }).map((_, i) => {
  const usedByIdx = i % people.length;
  return {
    _id: `p${i + 1}`,
    market: markets[i % markets.length],
    publisherName: `Publisher ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
    publisherPOC: `POC ${i + 1}`,
    contactDate: randomDate(),
    agencyPOC: `Agency ${(i % 5) + 1}`,
    status: statuses[i % statuses.length],
    notes: i % 3 === 0 ? "Follow up next week" : "",
    usedBy: people[usedByIdx],
    sheetId: sheetIds[usedByIdx],
    createdAt: `2026-${pad((i % 5) + 1)}-${pad((i % 27) + 1)}T10:00:00Z`,
  };
});
