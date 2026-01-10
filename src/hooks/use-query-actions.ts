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

    params.set("query", encodeQueryToBase64(query));

    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function restoreQueryFromUrl(setQuery: (query: RuleGroupTypeIC) => void) {
    const encoded = searchParams.get("query");

    if (!encoded) return;

    const decoded = decodeQueryFromBase64<RuleGroupTypeIC>(encoded);

    if (decoded && typeof decoded === "object" && "rules" in decoded) {
      setQuery(decoded);
    }
  }

  return { saveQueryToUrl, restoreQueryFromUrl };
}

function encodeQueryToBase64(query: unknown): string {
  const json = JSON.stringify(query);
  const base64 = btoa(
    encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16)),
    ),
  );

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeQueryFromBase64<T = unknown>(value: string): T | null {
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}
