import { getField } from "@/lib/query/fields";
import { getIcon } from "@/lib/query/icons";
import { isOptionGroup } from "@/lib/query/option";
import { FIELD_DESCRIPTIONS } from "@/lib/users/user-constants";
import { cn } from "@/lib/utils";
import { useQueryBuilderState } from "@/providers/query-builder-state-provider";
import { CustomRuleType, FieldWithIcon } from "@/types/types";
import { IconCaretRightFilled } from "@tabler/icons-react";
import { useState } from "react";
import { FieldSelectorProps } from "react-querybuilder";
import Search from "../ui/search";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

export function FieldSelector(props: FieldSelectorProps) {
  const { fields } = useQueryBuilderState();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hoveredField, setHoveredField] = useState<FieldWithIcon | undefined>();
  const field = getField(fields, props.value);
  const rule = props.rule as CustomRuleType;
  const inputType = rule.inputType ?? field?.inputType ?? "text";
  const Icon = getIcon(inputType);

  const filtered = props.options.filter(
    (option) =>
      !isOptionGroup(option) &&
      option.name.toLowerCase().startsWith(search.toLowerCase()),
  );

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) setSearch("");
      }}
    >
      <PopoverTrigger title="" asChild>
        <Button
          variant="ghost"
          className="group text-sm rounded-sm bg-table-header dark:bg-table-header border-table-header group-hover:border-primary outline-none group-hover:bg-primary/10 hover:text-primary cursor-pointer focus-visible:border-none focus-visible:ring-0"
        >
          <div className="flex items-center gap-1.5">
            <Icon
              className={cn(
                "group-hover:text-primary text-foreground",
                inputType === "text" && "size-5",
              )}
            />
            <div className="flex items-center">
              <p className="text-muted-foreground text-xs">User</p>
              <IconCaretRightFilled className="size-3 text-muted-foreground" />
              <p className="text-foreground group-hover:text-primary">
                {field?.label}
              </p>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-96 p-2">
        <div className="flex flex-col w-full">
          <Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onResetField={() => setSearch("")}
            placeholder="Search..."
            className="mb-3 w-full"
            autoResize={false}
          />
          <div className="w-full grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              {filtered.map((option) => {
                if (isOptionGroup(option)) {
                  return option.options.map((o) => (
                    <Button key={o.name} value={o.value}>
                      {o.label}
                    </Button>
                  ));
                }

                if (option.name === "isDev" || option.name === "birthdate")
                  return null;
                const OptionIcon = getIcon(option.inputType ?? "text");

                return (
                  <Button
                    variant={props.value === option.name ? "default" : "ghost"}
                    key={option.label}
                    value={option.name}
                    onMouseEnter={() =>
                      setHoveredField({ ...option, icon: OptionIcon })
                    }
                    onClick={() => {
                      props.handleOnChange(option.value);
                      setOpen(false);
                    }}
                    className="flex justify-start items-center cursor-pointer"
                  >
                    <OptionIcon
                      className={cn(
                        "group-hover:text-primary",
                        inputType === "text" && "size-5",
                      )}
                    />
                    {option.label}
                  </Button>
                );
              })}
            </div>
            {hoveredField && (
              <div className="flex flex-col gap-4 p-2 border-l">
                <div className="flex items-center gap-3">
                  <hoveredField.icon
                    className={cn(
                      "group-hover:text-primary",
                      hoveredField.inputType === "text" ? "size-5" : "size-4",
                    )}
                  />
                  <div className="flex items-center gap-1">
                    <p className="text-muted-foreground text-sm font-semibold">
                      User
                    </p>
                    <IconCaretRightFilled className="size-3" />
                    <p className="text-sm font-semibold">
                      {hoveredField.label}
                    </p>
                  </div>
                </div>
                <p className="text-xs">
                  {FIELD_DESCRIPTIONS[hoveredField.name]}
                </p>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
