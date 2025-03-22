import { api } from "./api/apiClient";
import {
  DashboardSummary,
  UserStatsData,
  ContentStatsData,
  SpeciesStatsData,
  TopViewedSpecies,
  TopSearch,
  ModerationQueueResponse,
  SpeciesListResponse,
  User,
} from "../models";

// Dashboard Data
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return api.get<DashboardSummary>("/api/admin/dashboard/summary");
}

export async function getUserStats(): Promise<UserStatsData> {
  return api.get<UserStatsData>("/api/admin/dashboard/users");
}

export async function getUserList(
  params: Record<string, any> = {}
): Promise<{ users: User[]; totalPages: number }> {
  const queryString = new URLSearchParams(params).toString();
  return api.get<{ users: User[]; totalPages: number }>(
    `/api/admin/users?${queryString}`
  );
}

export async function updateUserStatus(
  userId: number,
  isActive: boolean
): Promise<any> {
  return api.put<any>(`/api/admin/users/${userId}/status`, {
    isActive,
  });
}

export async function getContentStats(): Promise<ContentStatsData> {
  return api.get<ContentStatsData>("/api/admin/dashboard/content");
}

export async function getSpeciesStats(): Promise<SpeciesStatsData> {
  return api.get<SpeciesStatsData>("/api/admin/dashboard/species");
}

// Analytics
export async function getTopViewedSpecies(
  limit = 10,
  days = 30
): Promise<TopViewedSpecies[]> {
  return api.get<TopViewedSpecies[]>(
    `/api/admin/analytics/top-species?limit=${limit}&days=${days}`
  );
}

export async function getTopSearches(
  limit = 10,
  days = 30
): Promise<TopSearch[]> {
  return api.get<TopSearch[]>(
    `/api/admin/analytics/top-searches?limit=${limit}&days=${days}`
  );
}

// Content Moderation
export async function getModerationQueue(
  params: Record<string, any> = {}
): Promise<ModerationQueueResponse> {
  const queryString = new URLSearchParams(params).toString();
  return api.get<ModerationQueueResponse>(
    `/api/admin/moderation/queue?${queryString}`
  );
}

export async function moderateContent(
  contentId: number,
  data: { status: string; reason?: string }
): Promise<any> {
  return api.put<any>(`/api/admin/moderation/${contentId}`, data);
}

export async function bulkModerateContent(data: {
  contentIds: number[];
  status: string;
  reason?: string;
}): Promise<any> {
  return api.post<any>("/api/admin/moderation/bulk", data);
}

// Species Management
export async function getSpeciesList(
  params: Record<string, any> = {}
): Promise<SpeciesListResponse> {
  const queryString = new URLSearchParams(params).toString();
  return api.get<SpeciesListResponse>(`/api/admin/species?${queryString}`);
}

export async function createSpecies(formData: FormData): Promise<any> {
  return api.post<any>("/api/admin/species", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function updateSpecies(
  compositeKey: string,
  formData: FormData
): Promise<any> {
  return api.put<any>(`/api/admin/species/${compositeKey}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
