import { normalizeObject } from "@/lib/normalize-query";
import { Sort, User } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { RuleGroupTypeIC } from "react-querybuilder";

export function useUsers(query: RuleGroupTypeIC, search: string, sort: Sort) {
  // normalize the query to be used as a key
  const normalized = normalizeObject({ query, search, sort });

  return useQuery<User[]>({
    queryKey: ["users", normalized],
    queryFn: async () => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: normalized,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      return res.json();
    },
    staleTime: 3_000,
  });
}
