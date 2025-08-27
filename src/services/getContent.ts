import { axiosClient } from "@/api/axiosClient";

export async function getContent<T>(endpoint: string, signal?: AbortSignal): Promise<T[]> {
  const { data } = await axiosClient.get<T[]>(endpoint, { signal })
  return data
}