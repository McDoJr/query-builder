"use client";

import { decodeQuery, encodeQuery } from "@/lib/serializer";
import { useRouter, useSearchParams } from "next/navigation";
import {
  isRuleGroup,
  RuleGroupTypeAny,
  RuleGroupTypeIC,
} from "react-querybuilder";

export function useQueryActions() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function saveQueryToUrl(query?: RuleGroupTypeIC) {
    const params = new URLSearchParams(window.location.search);

    if (!query) {
      params.delete("query");

      router.replace(`?${params.toString()}`, { scroll: false });
      return;
    } else {
      const groups = query.rules.filter(isRuleGroup) as RuleGroupTypeAny[];
      if (groups.length === 1 && !groups[0].rules.length) {
        params.delete("query");

        router.replace(`?${params.toString()}`, { scroll: false });
        return;
      }
    }

    params.set("query", encodeQuery(query));

    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function restoreQueryFromUrl(setQuery: (query: RuleGroupTypeIC) => void) {
    const encoded = searchParams.get("query");

    if (!encoded) return;

    const decoded = decodeQuery<RuleGroupTypeIC>(encoded);

    if (decoded && typeof decoded === "object" && "rules" in decoded) {
      setQuery(decoded);
    }
  }

  return { saveQueryToUrl, restoreQueryFromUrl };
}
