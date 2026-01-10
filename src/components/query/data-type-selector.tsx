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
import { generateID, RuleGroupTypeIC, RuleType } from "react-querybuilder";
import { DateRangeUnit } from "@/types/types";

type DataTypeSelectorProps = {
  field: string;
  inputType: string;
  id?: string;
};

function updateRule(
  rules: RuleGroupTypeIC["rules"],
  ruleId: string,
  inputType: string,
): RuleGroupTypeIC["rules"] {
  return rules.map((r) => {
    if (typeof r === "object" && "rules" in r) {
      return { ...r, rules: updateRule(r.rules, ruleId, inputType) };
    }

    if (typeof r === "object" && r.id === ruleId) {
      return {
        ...r,
        operator: "=",
        inputType,
        value: "",
      };
    }

    return r;
  }) as RuleGroupTypeIC["rules"];
}

export function duplicateRuleById(
  rules: RuleGroupTypeIC["rules"],
  targetRuleId: string,
): RuleGroupTypeIC["rules"] {
  const result = [];

  for (const r of rules) {
    // Nested group
    if (typeof r === "object" && r && "rules" in r) {
      result.push({
        ...r,
        rules: duplicateRuleById(r.rules, targetRuleId),
      });
      continue;
    }

    result.push(r);

    if (typeof r === "object" && r && r.id === targetRuleId) {
      result.push("and");
      result.push(cloneRule(r));
    }
  }

  return result as RuleGroupTypeIC["rules"];
}

function cloneRule(rule: RuleType): RuleType {
  return {
    ...structuredClone(rule),
    id: generateID(),
  };
}

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
                {<Icon />}
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
