"use client";

import { Dispatch, PropsWithChildren, SetStateAction, useMemo } from "react";
import { Button } from "./ui/button";
import { formatNumber } from "@/lib/utils";
import { IconFilterPlus } from "@tabler/icons-react";
import Search from "./ui/search";
import {
  useQueryBuilderActions,
  useQueryBuilderState,
} from "@/providers/query-builder-state-provider";
import { generateID, isRuleGroup, RuleGroupTypeIC } from "react-querybuilder";
import { Plus } from "lucide-react";
import { useQueryActions } from "@/hooks/use-query-actions";
import { User } from "@/types/types";

type QueryToolbarProps = PropsWithChildren<{
  filteredUsers: User[];
  hideFilter: boolean;
  setHideFilter: Dispatch<SetStateAction<boolean>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}>;

export default function QueryToolbar({
  setSearch,
  children,
  ...props
}: QueryToolbarProps) {
  const { query } = useQueryBuilderState();
  const { setQuery } = useQueryBuilderActions();
  const { saveQueryToUrl } = useQueryActions();

  // will be used to control rendering the add group button below
  const hasNonEmptySubGroup = useMemo(
    () => query.rules.some((r) => isRuleGroup(r) && r.rules.length > 0),
    [query],
  );

  const toggleHideFilter = () => props.setHideFilter((prev) => !prev);

  // function for adding group
  function addGroup() {
    setQuery(
      (prev) =>
        ({
          ...prev,
          rules: [...prev.rules, "and", { id: generateID(), rules: [] }],
        }) as RuleGroupTypeIC,
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold mb-3">Users</h1>
      <div className="flex justify-between items-center">
        <p className="text-sm">
          {formatNumber(props.filteredUsers.length)} Users with Profiles
        </p>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={toggleHideFilter}>
            <IconFilterPlus />
            {props.hideFilter ? "Show Filter" : "Hide Filter"}
          </Button>
          <Search
            placeholder="Search Profiles"
            value={props.search}
            onChange={(e) => setSearch(e.target.value)}
            onResetField={() => setSearch("")}
          />
        </div>
      </div>
      {!props.hideFilter && children}
      <div className="flex items-center justify-between">
        {hasNonEmptySubGroup && (
          <Button variant="ghost" onClick={addGroup}>
            <Plus />
            Group
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => {
            setQuery({
              rules: [
                {
                  id: generateID(),
                  rules: [],
                },
              ],
            });
            saveQueryToUrl(undefined);
          }}
          disabled={!query.rules.length}
          className="ml-auto"
        >
          Clear all
        </Button>
      </div>
    </div>
  );
}
