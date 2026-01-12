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

  if (rule.operator === "last" || rule.operator === "next") {
    const [from, to]: string[] = rule.value.split(",");
    return `${field} between '${from}' and '${to}'`;
  }

  // if the type in rule was not modified, then use the original field type
  if ((rule.inputType ?? type) === "text") {
    const customField = type === "text" ? field : `(${field})::text`;
    const values = rule.value
      .split(",")
      .map((val: string) => `'${val}'`)
      .join(",");
    return `${customField} IN (${values})`;
  }

  const result = defaultRuleProcessorSQL(rule, options, meta);

  // if the type from rule is text and the original field type is not a text, then parse this field as a text to avoid an sql error
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
