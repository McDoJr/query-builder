import { InputHTMLAttributes } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Search({
  onResetField,
  autoResize = true,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  onResetField: () => void;
  autoResize?: boolean;
}) {
  return (
    <InputGroup
      className={cn(
        "bg-table-header w-42 dark:bg-table-header border-transparent hover:border-primary has-[[data-slot=input-group-control]:focus-visible]:border-primary has-[[data-slot=input-group-control]:focus-visible]:ring-primary/50",
        autoResize &&
          "has-[[data-slot=input-group-control]:focus-visible]:w-xs transition-all duration-200",
        className,
      )}
    >
      <InputGroupInput {...props} />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      {props.value && (
        <InputGroupAddon align="inline-end">
          <X className="cursor-pointer" onClick={onResetField} />
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
