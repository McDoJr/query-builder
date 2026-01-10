import { CustomRuleType } from "@/types/types";
import { FIELD_TYPES } from "./user-constants";
import { defaultRuleProcessorSQL, InputType } from "react-querybuilder";

export function getUserRuleProcessor(
  rule: CustomRuleType,
  options: any,
  meta: any,
) {
  const field = `"${rule.field}"`;
  const type = FIELD_TYPES[rule.field] as InputType;

  const result = defaultRuleProcessorSQL(rule, options, meta);

  if (rule.operator === "last" || rule.operator === "next") {
    const [from, to]: string[] = rule.value.split(",");
    return `${field} between '${from}' and '${to}'`;
  }

  if (type !== "text" && rule.inputType === "text") {
    return `(${field})::text ${result.split(" ").slice(1).join(" ")}`;
  }

  if (type !== "date" && rule.inputType === "date") {
    return `(${field})::text ${result.split(" ").slice(1).join(" ")}`;
  }

  if (rule.operator === "isNumeric") {
    return `(${field})::text ~ '^[0-9]+(\\.[0-9]+)?$'`;
  }

  if (rule.operator === "isNotNumeric") {
    return `NOT ((${field})::text ~ '^[0-9]+(\\.[0-9]+)?$')`;
  }

  return result;
}
