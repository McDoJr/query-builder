import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  BaseOption,
  CombinatorSelectorProps,
  OptionGroup,
} from "react-querybuilder";

export function CombinatorSelector({
  options,
  value,
  handleOnChange,
  className,
}: CombinatorSelectorProps) {
  return (
    <Select value={value} onValueChange={handleOnChange}>
      <SelectTrigger
        className={cn(
          "rounded-sm text-muted-foreground lowercase bg-transparent dark:bg-transparent border-none outline-none hover:bg-primary/10 dark:hover:bg-primary/10 hover:text-primary cursor-pointer focus-visible:border-none focus-visible:ring-0 shadow-none",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        {options.map((option) => {
          if (isOptionGroup(option)) {
            return option.options.map((o) => (
              <SelectItem key={o.name} value={o.value}>
                {o.label}
              </SelectItem>
            ));
          }

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

function isOptionGroup<T extends BaseOption>(
  option: T | OptionGroup<T>,
): option is OptionGroup<T> {
  return "options" in option;
}
