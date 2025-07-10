import { useQuery } from "@tanstack/react-query";
// Remove all supabase imports and code. Use REST API for users now.
import { User } from "./types";

export function useUsers() {
  return { data: [], isLoading: false };
}

export function useUserById(userId: string | undefined) {
  return { data: {}, isLoading: false };
}
