import {
  FullField,
  parseNumber,
  useValueEditor,
  ValueEditorProps,
} from "react-querybuilder";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useEffect, memo, useState } from "react";

import { CustomRuleType } from "@/types/types";
import DateValueEditor from "./date-value-editor";
import DataTypeSelector from "./data-type-selector";

/**
 * Component extracted from react-querybuilder and was modified
 * - local state only
 * - commit on Enter or Blur
 * - supports between / notBetween
 */

export const ValueEditor = memo(function ValueEditor<F extends FullField>(
  allProps: ValueEditorProps<F>,
): React.JSX.Element | null {
  const {
    operator,
    value,
    handleOnChange,
    title,
    className,
    type = "text",
    inputType,
    fieldData,
    disabled,
    testID,
    rule: originalRule,
  } = allProps;

  const {
    valueAsArray,
    multiValueHandler,
    parseNumberMethod,
    valueListItemClassName,
    inputTypeCoerced,
  } = useValueEditor(allProps);

  const [localValue, setLocalValue] = useState(value ?? "");
  const [localArray, setLocalArray] = useState<string[]>([]);

  const placeholder = fieldData?.placeholder ?? "";
  const rule = originalRule as CustomRuleType;

  /**
   * this useEffects is needed so it can track value and valueAsArray
   * changes when a field or data type was changed to keep it sync in the UI
   */
  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  useEffect(() => {
    if (Array.isArray(valueAsArray)) {
      setLocalArray(valueAsArray.map((v) => v ?? ""));
    }
  }, [valueAsArray]);

  function commitSingleValue() {
    if (localValue !== value) {
      handleOnChange(
        parseNumber(localValue, { parseNumbers: parseNumberMethod }),
      );
    }
  }

  function commitArrayValue(index: number) {
    const v = localArray[index];
    if (v !== valueAsArray[index]) {
      multiValueHandler(
        parseNumber(v, { parseNumbers: parseNumberMethod }),
        index,
      );
    }
  }

  const ruleType = rule.inputType ?? inputType ?? type ?? "text";

  if (operator === "null" || operator === "notNull") return null;

  if (operator === "isNumeric" || operator === "isNotNumeric") {
    return (
      <DataTypeSelector
        field={allProps.field}
        inputType={ruleType}
        id={rule.id}
      />
    );
  }

  if (ruleType === "date") {
    return <DateValueEditor {...(allProps as ValueEditorProps)} />;
  }

  if (operator === "between" || operator === "notBetween") {
    return (
      <span
        data-testid={testID}
        className="flex items-center gap-2"
        title={title}
      >
        <Input
          type={inputTypeCoerced}
          placeholder={placeholder}
          value={localArray[0] ?? ""}
          className={cn(valueListItemClassName, "placeholder:text-primary")}
          disabled={disabled}
          onChange={(e) => {
            const next = [...localArray];
            next[0] = e.target.value;
            setLocalArray(next);
          }}
          onBlur={() => commitArrayValue(0)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitArrayValue(0);
              (e.target as HTMLInputElement).blur();
            }
          }}
        />

        <p className="text-sm text-muted-foreground font-semibold">and</p>

        <Input
          type={inputTypeCoerced}
          placeholder={placeholder}
          value={localArray[1] ?? ""}
          className={cn(valueListItemClassName, "placeholder:text-primary")}
          disabled={disabled}
          onChange={(e) => {
            const next = [...localArray];
            next[1] = e.target.value;
            setLocalArray(next);
          }}
          onBlur={() => commitArrayValue(1)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitArrayValue(1);
              (e.target as HTMLInputElement).blur();
            }
          }}
        />

        <DataTypeSelector
          id={rule.id}
          field={allProps.field}
          inputType={ruleType}
        />
      </span>
    );
  }

  // default text / number
  return (
    <div className="flex items-center gap-2">
      <Input
        data-testid={testID}
        type={ruleType}
        placeholder={placeholder}
        value={localValue}
        title={title}
        className={className}
        disabled={disabled}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={commitSingleValue}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitSingleValue();
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
      <DataTypeSelector
        id={rule.id}
        field={allProps.field}
        inputType={ruleType}
      />
    </div>
  );
});
