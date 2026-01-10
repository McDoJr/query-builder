import {
  DefaultOperators,
  Field,
  InputType,
  Operator,
  OptionList,
} from "react-querybuilder";

export const STRING_OPERATORS: DefaultOperators = [
  { name: "=", value: "=", label: "Is" },
  { name: "!=", value: "!=", label: "Is not" },
  { name: "contains", value: "contains", label: "Contains" },
  {
    name: "doesNotContain",
    value: "doesNotContain",
    label: "Does not contain",
  },
  { name: "beginsWith", value: "beginsWith", label: "Begins with" },
  { name: "endsWith", value: "endsWith", label: "Ends with" },
];

export const NUMBER_OPERATORS: OptionList<Operator> = [
  { name: "=", value: "=", label: "Equals" },
  { name: "!=", value: "!=", label: "Not equal" },
  { name: ">", value: ">", label: "Greater than" },
  { name: ">=", value: ">=", label: "Greater than or equal to" },
  { name: "<", value: "<", label: "Less than" },
  { name: "<=", value: "<=", label: "Less than or equal to" },
  { name: "between", value: "between", label: "Between" },
  { name: "notBetween", value: "notBetween", label: "Not between" },
  {
    name: "isNumeric",
    value: "isNumeric",
    label: "Is numeric",
  },
  {
    name: "isNotNumeric",
    value: "isNotNumeric",
    label: "Is not numeric",
  },
];

export const DATE_OPERATORS = [
  { name: "=", value: "=", label: "On" },
  { name: "!=", value: "!=", label: "Not on" },
  { name: "<", value: "<", label: "Before" },
  { name: ">", value: ">", label: "After" },
  { name: "between", value: "between", label: "Between" },
  { name: "notBetween", value: "notBetween", label: "Not between" },
  // { name: "since", label: "Since" },
  { name: "last", label: "Last" },
  // { name: "notLast", label: "Not in the last" },
  { name: "next", label: "In the next" },
];

export const BOOLEAN_OPERATORS: DefaultOperators = [
  { name: "=", value: "=", label: "Is" },
  { name: "!=", value: "!=", label: "Is not" },
  { name: "null", value: "null", label: "Is null" },
  { name: "notNull", value: "notNull", label: "Is not null" },
];

export const OPERATORS_BY_TYPE = {
  text: STRING_OPERATORS,
  number: NUMBER_OPERATORS,
  checkbox: BOOLEAN_OPERATORS,
  date: DATE_OPERATORS,
} as const;

export function getOperatorsFromType(inputType: InputType): DefaultOperators {
  const operators =
    OPERATORS_BY_TYPE[inputType as keyof typeof OPERATORS_BY_TYPE];
  return (operators ?? OPERATORS_BY_TYPE["text"]) as DefaultOperators;
}

export function getOperators(
  _: string,
  misc: { fieldData: Field },
): OptionList<Operator> | null {
  const fieldType = misc.fieldData.inputType as InputType;
  const operators =
    OPERATORS_BY_TYPE[fieldType as keyof typeof OPERATORS_BY_TYPE];
  return operators;
}

export const defaultOperators: DefaultOperators = [
  { name: "=", value: "=", label: "Equals" },
  { name: "!=", value: "!=", label: "Not equal" },
  { name: "<", value: "<", label: "Less than" },
  { name: ">", value: ">", label: "Greater than" },
  { name: "<=", value: "<=", label: "Less than or equal to" },
  { name: ">=", value: ">=", label: "Greater than or equal to" },
  { name: "contains", value: "contains", label: "Contains" },
  { name: "beginsWith", value: "beginsWith", label: "Begins with" },
  { name: "endsWith", value: "endsWith", label: "Ends with" },
  {
    name: "doesNotContain",
    value: "doesNotContain",
    label: "Does not contain",
  },
  {
    name: "doesNotBeginWith",
    value: "doesNotBeginWith",
    label: "Does not begin with",
  },
  {
    name: "doesNotEndWith",
    value: "doesNotEndWith",
    label: "Does not end with",
  },
  { name: "null", value: "null", label: "Is null" },
  { name: "notNull", value: "notNull", label: "Is not null" },
  { name: "in", value: "in", label: "In" },
  { name: "notIn", value: "notIn", label: "Not in" },
  { name: "between", value: "between", label: "Between" },
  { name: "notBetween", value: "notBetween", label: "Not between" },
];
