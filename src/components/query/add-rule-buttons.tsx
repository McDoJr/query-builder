import {
  type RuleType,
  type Path,
  type RuleGroupTypeAny,
  type ActionProps,
} from "react-querybuilder";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import Search from "../ui/search";
import {
  useQueryBuilderActions,
  useQueryBuilderState,
} from "@/providers/query-builder-state-provider";
import { getFieldKeys } from "@/lib/query/fields";

export type AddRuleButtonsProps = ActionProps & {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function AddRuleButtons(props: ActionProps) {
  const { fields } = useQueryBuilderState();
  const { updatePopoverByGroupID } = useQueryBuilderActions();
  const [search, setSearch] = useState("");

  const fieldKeys = getFieldKeys(fields).filter((f) =>
    f.name.toLowerCase().includes(search),
  );

  const groupId = props.ruleOrGroup?.id;

  if (!groupId) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <Search
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onResetField={() => setSearch("")}
        placeholder="Search..."
        className="mb-3 w-full"
        autoResize={false}
      />
      {fieldKeys.map(({ icon: Icon, ...field }) => (
        <Button
          key={field.name}
          variant="ghost"
          onClick={(e) => {
            props.handleOnClick(e, field.name);
            updatePopoverByGroupID(groupId, false);
          }}
          className="justify-start"
        >
          <Icon className={field.inputType === "text" ? "size-5" : "size-4"} />
          {field.label}
        </Button>
      ))}
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
    // operator: "=",
    // You might need a function to determine the appropriate default value based on the field type
    // value: fieldData.defaultValue || "",
  };
};
