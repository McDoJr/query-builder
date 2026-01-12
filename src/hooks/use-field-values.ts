import { normalizeObject } from "@/lib/normalize-query";
import { sortFieldValues } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function useFieldValues(
  field: string,
  type: string,
  selected: string[],
) {
  const normalized = normalizeObject({ field, type });

  return useQuery<string[]>({
    queryKey: ["field", normalized],
    queryFn: async () => {
      const res = await fetch("/api/values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: normalized,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const values: string[] = await res.json();
      sortFieldValues(values, selected);
      return values;
    },
  });
}
