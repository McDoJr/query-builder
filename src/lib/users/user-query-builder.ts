import { formatQuery, isRuleGroup, RuleGroupTypeIC } from "react-querybuilder";
import { buildSearchSQL, buildSortSQL } from "./user-options";
import { UsersQueryOptions } from "@/types/types";
import { getUserRuleProcessor } from "./user-rule-processor";

export function buildUsersSQL(options: UsersQueryOptions) {
  const { query: rawQuery, search, sort } = options;
  const query = cleanQuery(rawQuery);

  let sql = 'SELECT * FROM "User"';
  const whereParts: string[] = [];

  if (query && !isRootGroupEmpty(query)) {
    whereParts.push(
      formatQuery(query, {
        format: "sql",
        quoteFieldNamesWith: '"',
        ruleProcessor: getUserRuleProcessor,
      }),
    );
  }

  const searchSQL = buildSearchSQL(search);
  if (searchSQL) whereParts.push(searchSQL);

  if (whereParts.length > 0) {
    sql += ` WHERE ${whereParts.join(" AND ")}`;
  }

  const orderBySQL = buildSortSQL(sort);
  if (orderBySQL) sql += ` ${orderBySQL}`;

  return sql;
}

function cleanQuery(group: RuleGroupTypeIC): RuleGroupTypeIC {
  return {
    ...group,
    rules: group.rules
      .filter((rule) => {
        if (isRuleGroup(rule)) return true;
        if (typeof rule === "string") return true;
        if (rule.operator.includes("Numeric")) return true;
        return (
          rule.value !== "" && rule.value !== null && rule.value !== undefined
        );
      })
      .map((rule) => (isRuleGroup(rule) ? cleanQuery(rule) : rule)),
  } as RuleGroupTypeIC;
}

function isRootGroupEmpty(query: RuleGroupTypeIC) {
  return query.rules.every(
    (group) => isRuleGroup(group) && group.rules.length === 0,
  );
}
