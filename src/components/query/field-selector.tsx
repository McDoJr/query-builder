import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getField } from "@/lib/query/fields";
import { getIcon } from "@/lib/query/icons";
import { isOptionGroup } from "@/lib/query/option";
import { cn } from "@/lib/utils";
import { useQueryBuilderState } from "@/providers/query-builder-state-provider";
import { CustomRuleType } from "@/types/types";
import { IconCaretRightFilled } from "@tabler/icons-react";
import { FieldSelectorProps } from "react-querybuilder";

export function FieldSelector(props: FieldSelectorProps) {
  const { fields } = useQueryBuilderState();
  const field = getField(fields, props.value);
  const rule = props.rule as CustomRuleType;
  const inputType = rule.inputType ?? field?.inputType ?? "text";
  const Icon = getIcon(inputType);

  return (
    <Select value={props.value} onValueChange={props.handleOnChange}>
      <SelectTrigger
        title=""
        className="group text-sm rounded-sm bg-table-header dark:bg-table-header border-table-header hover:border-primary outline-none hover:bg-primary/10 hover:text-primary cursor-pointer focus-visible:border-none focus-visible:ring-0"
      >
        <SelectValue>
          <div className="flex items-center gap-1.5">
            <Icon
              className={cn(
                "group-hover:text-primary",
                inputType === "text" && "size-5",
              )}
            />
            <div className="flex items-center">
              <p className="text-muted-foreground text-xs">User</p>
              <IconCaretRightFilled className="size-3" />
              {field?.label}
            </div>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" align="start" className="w-46">
        {props.options.map((option) => {
          if (isOptionGroup(option)) {
            return option.options.map((o) => (
              <SelectItem key={o.name} value={o.value}>
                {o.label}
              </SelectItem>
            ));
          }

          if (option.name === "isDev" || option.name === "birthdate")
            return null;
          const OptionIcon = getIcon(option.inputType ?? "text");

          return (
            <SelectItem
              key={option.label}
              value={option.name}
              className="cursor-pointer"
            >
              <OptionIcon
                className={cn(
                  "group-hover:text-primary",
                  inputType === "text" && "size-5",
                )}
              />
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
