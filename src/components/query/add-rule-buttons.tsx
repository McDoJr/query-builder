import {
  type RuleType,
  type Path,
  type RuleGroupTypeAny,
  type ActionProps,
} from "react-querybuilder";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Search from "../ui/search";
import {
  useQueryBuilderActions,
  useQueryBuilderState,
} from "@/providers/query-builder-state-provider";
import { getFieldKeys } from "@/lib/query/fields";
import { FieldWithIcon } from "@/types/types";
import { Separator } from "../ui/separator";
import { IconCaretRightFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { FIELD_DESCRIPTIONS } from "@/lib/users/user-constants";

export type AddRuleButtonsProps = ActionProps & {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function AddRuleButtons(props: ActionProps) {
  const { fields } = useQueryBuilderState();
  const { updatePopoverByGroupID } = useQueryBuilderActions();
  const [search, setSearch] = useState("");
  const [hoveredField, setHoveredField] = useState<FieldWithIcon | undefined>();

  useEffect(() => {
    return () => setHoveredField(undefined);
  }, []);

  const fieldKeys = getFieldKeys(fields).filter((f) =>
    f.name.toLowerCase().includes(search),
  );

  const groupId = props.ruleOrGroup?.id;

  if (!groupId) {
    return null;
  }

  function onMouseEnter(currentField: FieldWithIcon) {
    setHoveredField(currentField);
  }

  return (
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
        <div className="flex flex-col">
          {fieldKeys.map((field) => {
            const Icon = field.icon;
            return (
              <Button
                key={field.name}
                variant="ghost"
                onMouseEnter={() => onMouseEnter(field)}
                onClick={(e) => {
                  props.handleOnClick(e, field.name);
                  updatePopoverByGroupID(groupId, false);
                }}
                className="justify-start"
              >
                <Icon
                  className={field.inputType === "text" ? "size-5" : "size-4"}
                />
                {field.label}
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
                <p className="text-sm font-semibold">{hoveredField.label}</p>
              </div>
            </div>
            <p className="text-xs">{FIELD_DESCRIPTIONS[hoveredField.name]}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const onAddRule = (
  rule: RuleType,
  _pP: Path,
  _q: RuleGroupTypeAny,
  context?: string,
) => {
  if (typeof context !== "string") return rule;

  // Return the modified rule with the pre-selected field, operator, and a default value
  return {
    ...rule,
    field: context,
  };
};
