import { BaseOption, OptionGroup } from "react-querybuilder";

export function isOptionGroup<T extends BaseOption>(
  option: T | OptionGroup<T>,
): option is OptionGroup<T> {
  return "options" in option;
}
