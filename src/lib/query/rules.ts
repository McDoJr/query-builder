import { RuleGroupTypeIC } from "react-querybuilder";

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
