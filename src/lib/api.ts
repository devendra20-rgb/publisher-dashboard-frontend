// API Base URL
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:5000/api";

import type {
  Sheet,
  PublisherResponse,
  ApiResponse,
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