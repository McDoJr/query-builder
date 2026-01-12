import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { DateRange } from "react-day-picker";
import {
  Field,
  InputType,
  RuleGroupTypeIC,
  RuleType,
} from "react-querybuilder";

export type User = {
  name: string;
  id: string;
  age: number;
  address: string;
  phone: string;
  email: string;
  twitter: string;
  isDev: boolean;
  createdAt: string;
  birthdate: string;
};

export type ColumnsMeta = {
  onClick: (key: keyof User) => void;
  sort?: Sort;
};

export type SortKey = keyof User;

export type FieldRow = {
  id: string | undefined;
  type: InputType;
};

export type Sort = {
  key?: string;
  order?: "asc" | "desc";
};

// /api/users options
export type UsersQueryOptions = {
  query: RuleGroupTypeIC;
  search: string;
  sort: Sort;
};

export type FieldFor<T> = Field & {
  name: keyof T;
  rows: FieldRow[];
};

export type FieldWithIcon = Field & {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export type FieldRowAction = "update" | "delete";

export type RuleRef = {
  ruleId: string;
  field: string;
};

export type CustomRuleType = RuleType & {
  inputType?: string;
  unit?: DateRangeUnit;
};

export type DateRangeUnit = "days" | "weeks" | "months";

export type CustomDateRange = DateRange & { unit?: DateRangeUnit };
