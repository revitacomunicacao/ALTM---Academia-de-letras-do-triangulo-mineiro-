import { axiosClient } from "@/api/axiosClient";

export async function getContentById<T>(endpoint: string, id: number | string, signal?: AbortSignal): Promise<T> {
  const { data } = await axiosClient.get<T>(`${endpoint}/${id}`, { signal })
  return data
}
