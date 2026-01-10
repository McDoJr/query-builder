import {
  defaultRuleProcessorJsonLogic,
  RuleGroupTypeIC,
  RuleProcessor,
} from "react-querybuilder";

export const customRuleProcessor: RuleProcessor = (rule, options) => {
  if (rule.operator === "isNumeric" || rule.operator === "isNotNumeric") {
    return { [rule.operator]: [{ var: rule.field }, rule.value] };
  }
  return defaultRuleProcessorJsonLogic(rule, options);
};

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
