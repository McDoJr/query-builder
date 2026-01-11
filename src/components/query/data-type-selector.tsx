"use client";

import { useQueryActions } from "@/hooks/use-query-actions";
import {
  useQueryBuilderActions,
  useQueryBuilderState,
} from "@/providers/query-builder-state-provider";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { IconDots } from "@tabler/icons-react";
import { getIcon } from "@/lib/query/icons";
import { Separator } from "../ui/separator";
import { CopyPlus } from "lucide-react";
import { duplicateRuleById, updateRule } from "@/lib/query/rules";

type DataTypeSelectorProps = {
  field: string;
  inputType: string;
  id?: string;
};

// component to be used for changing a rule's data type
export default function DataTypeSelector(props: DataTypeSelectorProps) {
  const { query } = useQueryBuilderState();
  const { setQuery } = useQueryBuilderActions();
  const { saveQueryToUrl } = useQueryActions();
  const [open, setOpen] = useState(false);

  const dataTypes = [
    { label: "String", value: "text" },
    { label: "Number", value: "number" },
    { label: "Date", value: "date" },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <IconDots />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-0 w-38 border-none flex flex-col gap-1"
      >
        <div className="flex flex-col gap-1 p-1 mt-3">
          <p className="text-sm text-muted-foreground px-2 mb-2 cursor-default">
            Data Type
          </p>
          {dataTypes.map((item) => {
            const Icon = getIcon(item.value);
            return (
              <Button
                key={item.value}
                variant={item.value === props.inputType ? "default" : "ghost"}
                onClick={() => {
                  const resultQuery = {
                    ...query,
                    rules: updateRule(query.rules, props.id!, item.value),
                  };
                  setQuery(resultQuery);
                  saveQueryToUrl(resultQuery);
                  setOpen(false);
                }}
                className="justify-start"
              >
                {
                  <Icon
                    className={item.value === "text" ? "size-5" : "size-4"}
                  />
                }
                <p className="capitalize">{item.label}</p>
              </Button>
            );
          })}
        </div>
        <Separator />
        <div className="p-1 flex flex-col">
          <p className="text-sm text-muted-foreground px-2 mb-2 cursor-default">
            Options
          </p>
          <Button
            className="text-foreground justify-start"
            variant="ghost"
            onClick={() => {
              const resultQuery = {
                ...query,
                rules: duplicateRuleById(query.rules, props.id!),
              };
              setQuery(resultQuery);
              saveQueryToUrl(resultQuery);
              setOpen(false);
            }}
          >
            <CopyPlus />
            Duplicate
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
