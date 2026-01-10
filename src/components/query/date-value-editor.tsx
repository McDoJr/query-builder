import { toISODateLocal } from "@/lib/utils";
import React from "react";
import { DateRange } from "react-day-picker";
import {
  FullField,
  useValueEditor,
  ValueEditorProps,
} from "react-querybuilder";
import Calendar23 from "../calendar-23";
import { Calendar22 } from "../calendar-22";
import DataTypeSelector from "./data-type-selector";
import { CustomRuleType, DateRangeUnit } from "@/types/types";

const DateValueEditor = React.memo(function DateValueEditor<
  F extends FullField,
>(allProps: ValueEditorProps<F>): React.JSX.Element | null {
  const {
    operator,
    value,
    handleOnChange,
    title,
    inputType,
    testID,
    rule: originalRule,
  } = allProps;

  const { valueAsArray } = useValueEditor(allProps);
  const rule = originalRule as CustomRuleType;
  const ruleType = rule.inputType ?? inputType ?? "text";

  // todo: persist unit on page refresh
  function commitDateRange(range: DateRange | undefined, unit?: DateRangeUnit) {
    if (!range || !range.from || !range.to) return;

    const values = [toISODateLocal(range.from), toISODateLocal(range.to)];
    handleOnChange(
      operator === "last" || operator === "next" ? values.join(",") : values,
    );
  }

  function getDateDefaultValue() {
    switch (operator) {
      case "between":
      case "notBetween":
        return Array.isArray(valueAsArray) && valueAsArray.length === 2
          ? {
              from: new Date(valueAsArray[0]),
              to: new Date(valueAsArray[1]),
            }
          : undefined;
      default: {
        if (value) {
          const [from, to] = value.split(",");
          return { from: new Date(from), to: new Date(to) };
        }
        return undefined;
      }
    }
  }

  const isRangeOperator = ["between", "notBetween", "last", "next"].includes(
    operator,
  );

  if (isRangeOperator) {
    return (
      <span
        data-testid={testID}
        className="flex items-center gap-2"
        title={title}
      >
        <Calendar23
          withHeader={!operator.toLowerCase().includes("between")}
          defaultRangeValue={getDateDefaultValue()}
          operator={operator}
          commitDateRange={commitDateRange}
          unit={rule.unit}
        />

        <DataTypeSelector
          id={rule.id}
          field={allProps.field}
          inputType={ruleType}
        />
      </span>
    );
  }

  // default single date selection
  return (
    <div className="flex items-center gap-2">
      <Calendar22
        defaultDateValue={
          typeof value === "string" && value ? new Date(value) : undefined
        }
        onDateChange={(date) =>
          handleOnChange(date ? toISODateLocal(date) : undefined)
        }
      />
      <DataTypeSelector
        id={rule.id}
        field={allProps.field}
        inputType={ruleType}
      />
    </div>
  );
});

export default DateValueEditor;
