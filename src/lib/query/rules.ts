import { generateID, RuleGroupTypeIC, RuleType } from "react-querybuilder";

export function getBeforeAfterCombinators(
  rules: RuleGroupTypeIC["rules"],
  index?: number,
): { before?: string; after?: string } {
  if (index === undefined) return {};
  const before = (
    index > 0 && typeof rules[index - 1] === "string"
      ? rules[index - 1]
      : undefined
  ) as string | undefined;
  const after = (
    index + 1 < rules.length && typeof rules[index + 1] === "string"
      ? rules[index + 1]
      : undefined
  ) as string | undefined;
  return { before, after };
}

export function updateRule(
  rules: RuleGroupTypeIC["rules"],
  ruleId: string,
  inputType: string,
): RuleGroupTypeIC["rules"] {
  return rules.map((r) => {
    if (typeof r === "object" && "rules" in r) {
      return { ...r, rules: updateRule(r.rules, ruleId, inputType) };
    }

    if (typeof r === "object" && r.id === ruleId) {
      return {
        ...r,
        operator: "=",
        inputType,
        value: "",
      };
    }

    return r;
  }) as RuleGroupTypeIC["rules"];
}

export function duplicateRuleById(
  rules: RuleGroupTypeIC["rules"],
  targetRuleId: string,
): RuleGroupTypeIC["rules"] {
  const result = [];

  for (const r of rules) {
    // Nested group
    if (typeof r === "object" && r && "rules" in r) {
      result.push({
        ...r,
        rules: duplicateRuleById(r.rules, targetRuleId),
      });
      continue;
    }

    result.push(r);

    if (typeof r === "object" && r && r.id === targetRuleId) {
      result.push("and");
      result.push(cloneRule(r));
    }
  }

  return result as RuleGroupTypeIC["rules"];
}

function cloneRule(rule: RuleType): RuleType {
  return {
    ...structuredClone(rule),
    id: generateID(),
  };
}
