import { getOperatorsFromType } from "@/lib/query/operators";
import { OperatorSelectorProps, RuleType } from "react-querybuilder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function OperatorSelector(props: OperatorSelectorProps) {
  const rule = props.rule as RuleType & { inputType?: string };

  const inputType: string =
    rule.inputType ?? props.fieldData.inputType ?? "text";

  const operators = getOperatorsFromType(inputType);

  return (
    <Select value={props.value} onValueChange={props.handleOnChange}>
      <SelectTrigger
        title=""
        className="group text-sm rounded-sm bg-table-header dark:bg-table-header border-table-header hover:border-primary outline-none hover:bg-primary/10 hover:text-primary cursor-pointer focus-visible:border-none focus-visible:ring-0"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {operators.map((option) => {
          return (
            <SelectItem key={option.label} value={option.name}>
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
