"use client";

import { useCallback, useState } from "react";
import { useQueryBuilderState } from "@/providers/query-builder-state-provider";
import dynamic from "next/dynamic";
import { useUsers } from "@/hooks/use-users";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Sort, SortKey } from "@/types/types";
import QueryToolbar from "@/components/query-toolbar";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";

const QueryBuilderClient = dynamic(
  () => import("@/components/query-builder-client"),
  { ssr: false },
);

export default function App() {
  const { query } = useQueryBuilderState();
  const [hideFilter, setHideFilter] = useState(false);
  const [sort, setSort] = useState<Sort>({});
  const [search, setSearch] = useState<string>("");
  // debounced it so it will only search after user is done typing
  const debouncedSearch = useDebouncedValue(search);
  const { data, isFetching } = useUsers(query, debouncedSearch, sort);

  // for toggling sort
  const toggleSort = useCallback((key: SortKey) => {
    setSort((prev) => {
      if (prev.key !== key) {
        return { key, order: "asc" };
      }

      return { key, order: prev.order === "asc" ? "desc" : "asc" };
    });
  }, []);

  return (
    <main className="w-full min-h-screen flex flex-col gap-3 p-8">
      <ThemeModeToggle />
      <QueryToolbar
        filteredUsers={data ?? []}
        hideFilter={hideFilter}
        setHideFilter={setHideFilter}
        search={search}
        setSearch={setSearch}
      >
        <QueryBuilderClient />
      </QueryToolbar>
      <DataTable
        data={data ?? []}
        columns={columns}
        isFetching={isFetching}
        meta={{
          onClick: toggleSort,
          sort,
        }}
      />
    </main>
  );
}
