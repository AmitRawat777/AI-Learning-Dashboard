import { apiGet } from "./client";
import type { User } from "../types/task";

interface UsersResponse {
  data: User[];
}

export async function fetchUsers(): Promise<User[]> {
  const result = await apiGet<UsersResponse>("/api/users");
  return result.data;
}
