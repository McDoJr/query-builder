import { Sort } from "@/types/types";
import { OPTIONS } from "./user-constants";

export function buildSearchSQL(search?: string) {
  if (!search) return "";

  const escaped = search.replace(/%/g, "\\%").replace(/_/g, "\\_");
  const conditions = OPTIONS.searchableFields.map(
    (field) => `"${field}" ILIKE '%${escaped}%'`,
  );

  return `(${conditions.join(" OR ")})`;
}

export function buildSortSQL(sort?: Sort) {
  if (!sort?.key) return "";

  const direction = sort.order === "desc" ? "DESC" : "ASC";

  return `ORDER BY "${sort.key}" ${direction}`;
}
