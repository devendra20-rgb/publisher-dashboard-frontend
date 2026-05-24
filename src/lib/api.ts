// API Base URL
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:5000/api";

import type {
  Sheet,
  PublisherResponse,
  ApiResponse,
   PublisherDetail,
} from "@/types";

// ─────────────────────────────────────────────
// Safe Fetch Helper
// ─────────────────────────────────────────────
async function safeFetch<T>(
  url: string,
  opts?: RequestInit
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...opts,
      headers: {
        "Content-Type":
          "application/json",
        ...(opts?.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(
        "Request failed"
      );
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(error);

    return null;
  }
}

// ─────────────────────────────────────────────
// Fetch Sheets
// ─────────────────────────────────────────────
export async function fetchSheets(): Promise<
  Sheet[]
> {
  const res = await safeFetch<
    ApiResponse<Sheet[]>
  >(`${API_BASE}/sheets`);

  return res?.data || [];
}

// ─────────────────────────────────────────────
// Create Sheet
// ─────────────────────────────────────────────
export async function createSheet(
  payload: Omit<
    Sheet,
    "_id" | "createdAt" | "updatedAt"
  >
): Promise<Sheet | null> {
  const res = await safeFetch<
    ApiResponse<Sheet>
  >(`${API_BASE}/sheets`, {
    method: "POST",

    body: JSON.stringify(payload),
  });

  return res?.data || null;
}

// ─────────────────────────────────────────────
// Toggle Sheet
// ─────────────────────────────────────────────
export async function toggleSheet(
  id: string
): Promise<Sheet | null> {
  const res = await safeFetch<
    ApiResponse<Sheet>
  >(
    `${API_BASE}/sheets/${id}/toggle`,
    {
      method: "PATCH",
    }
  );

  return res?.data || null;
}

// ─────────────────────────────────────────────
// Delete Sheet
// ─────────────────────────────────────────────
export async function deleteSheet(
  id: string
): Promise<boolean> {
  const res = await safeFetch(
    `${API_BASE}/sheets/${id}`,
    {
      method: "DELETE",
    }
  );

  return !!res;
}

// ─────────────────────────────────────────────
// Publisher Query
// ─────────────────────────────────────────────
export interface PublisherQuery {
  usedBy?: string;
  market?: string;
  status?: string;
  publisherName?: string;
  sheetId?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  range?: string;
}

// export interface PublisherDetailsQuery {
//   pubId?: string;

//   publisherName?: string;

//   market?: string;

//   campaignWishlist?: string;

//   campaignType?: string;

//   mmpTrackingTool?: string;

//   page?: number;

//   limit?: number;
// }

export interface PublisherDetailsResponse {
  publisherDetails: PublisherDetail[];

  pagination: {
    total: number;

    page: number;

    limit: number;

    totalPages: number;

    hasNextPage: boolean;

    hasPrevPage: boolean;
  };
}


// ─────────────────────────────────────────────
// Fetch Publishers
// ─────────────────────────────────────────────
export async function fetchPublishers(
  q: PublisherQuery = {}
): Promise<PublisherResponse> {
  const params = new URLSearchParams();

  Object.entries(q).forEach(
    ([k, v]) => {
      if (
        v !== undefined &&
        v !== ""
      ) {
        params.set(k, String(v));
      }
    }
  );

  const res = await safeFetch<
    ApiResponse<PublisherResponse>
  >(
    `${API_BASE}/publishers?${params.toString()}`
  );

  if (res?.data) {
    return res.data;
  }

  return {
    publishers: [],

    pagination: {
      total: 0,

      page: 1,

      limit: 20,

      totalPages: 0,

      hasNextPage: false,

      hasPrevPage: false,
    },
  };
}

// ─────────────────────────────────────────────
// Fetch Publisher Details
// ─────────────────────────────────────────────
export interface PublisherDetailsQuery {
  pubId?: string;
  publisherName?: string;
  market?: string;
  campaignWishlist?: string;
  campaignType?: string;
  mmpTrackingTool?: string;
  page?: number;
  limit?: number;
}

export async function fetchPublisherDetails(
  q: PublisherDetailsQuery = {}
): Promise<any> {

  const params =
    new URLSearchParams();

  Object.entries(q).forEach(
    ([k, v]) => {

      if (
        v !== undefined &&
        v !== ""
      ) {
        params.set(
          k,
          String(v)
        );
      }

    }
  );

  const res =
    await safeFetch<any>(
      `${API_BASE}/publisher-details?${params.toString()}`
    );

  return (
    res?.data || {
      publisherDetails: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  );
}

// ─────────────────────────────────────────────
// Manual Sync Publisher Details
// ─────────────────────────────────────────────
export async function manualSyncPublisherDetails() {

  const res = await safeFetch(
    `${API_BASE}/publisher-details/sync`,
    {
      method: "POST",
    }
  );

  return res;
}