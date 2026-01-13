import React, { useEffect, useMemo, useState } from "react";
import { FullField, ValueEditorProps } from "react-querybuilder";
import DataTypeSelector from "./data-type-selector";
import { CustomRuleType } from "@/types/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import Search from "../ui/search";
import { cn, collectTextFormat, sortFieldValues } from "@/lib/utils";
import { Button } from "../ui/button";
import { useFieldValues } from "@/hooks/use-field-values";
import { Spinner } from "../ui/spinner";

const TextValueEditor = <F extends FullField>(
  allProps: ValueEditorProps<F>,
): React.JSX.Element | null => {
  const {
    value,
    handleOnChange,
    field,
    inputType,
    operator,
    type,
    rule: originalRule,
  } = allProps;

  const rule = originalRule as CustomRuleType;
  const ruleType = rule.inputType ?? inputType ?? type ?? "text";
  const defaultValues = useMemo(
    () => (typeof value === "string" && value.length ? value.split(",") : []),
    [value],
  );
  const [selected, setSelected] = useState<string[]>([...defaultValues]);
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const { data, isFetching } = useFieldValues(field, ruleType, selected);
  const [values, setValues] = useState<string[]>([]);

  const operatorWithCheckbox = ["=", "!="].includes(operator);

  const filtered = useMemo(() => {
    if (!values) return [];

    const lowerSearch = search.toLowerCase();

    return values.filter((d) => d.toLowerCase().includes(lowerSearch));
  }, [search, values]);

  // will use this for now, will find a better way to sync sorting only on data changes
  useEffect(() => {
    setValues(data ?? []);
  }, [data]);

  // if value was undefined, then reset selected
  useEffect(() => {
    if (!value) setSelected([]);
  }, [value]);

  const toggle = (value: string) => {
    if (!operatorWithCheckbox) {
      handleOnChange(value);
      setOpen(false);
      setSelectAll(false);
      return;
    }
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  // commit the selected values
  function commitValues() {
    const finalValue = operatorWithCheckbox ? selected.join(",") : search;
    handleOnChange(finalValue);
    setOpen(false);
    const vals = [...values];
    sortFieldValues(vals, selected);
    setValues(vals);
    setSelectAll(false);
  }

  const toggleSelectAll = () => {
    if (selected.length != filtered.length) {
      setSelected([...filtered]);
      setSelectAll(true);
      return;
    }

    setSelected(selectAll ? [] : [...filtered]);
    setSelectAll((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            setSearch("");
            setSelectAll(false);
            setSelected([...defaultValues]);
          }
          setOpen(open);
        }}
      >
        <PopoverTrigger
          className={cn(
            "w-auto h-9 justify-between border font-normal group text-sm rounded-sm bg-table-header dark:bg-table-header border-table-header dark:hover:border-primary hover:border-primary outline-none hover:bg-primary/10 hover:text-primary cursor-pointer focus-visible:border-none focus-visible:ring-0",
            "flex items-center justify-start px-2",
          )}
        >
          {collectTextFormat(value ? value.split(",") : [])}
        </PopoverTrigger>
        <PopoverContent className="p-0 rounded-lg flex flex-col" align="start">
          <div className="flex flex-col gap-4 p-3">
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoResize={false}
              onResetField={() => setSearch("")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search && !operatorWithCheckbox) {
                  e.preventDefault();
                  commitValues();
                  (e.target as HTMLInputElement).blur();
                }
              }}
              className="w-full"
            />
            <div className="flex flex-col gap-1 max-h-58 overflow-y-auto">
              {data && !isFetching ? (
                <React.Fragment>
                  {operatorWithCheckbox && (
                    <div
                      onClick={toggleSelectAll}
                      className="group flex items-center cusror-pointer rounded-lg p-2 gap-2 dark:hover:border-primary hover:border-primary outline-none hover:bg-primary/10 hover:text-primary cursor-pointer focus-visible:border-none focus-visible:ring-0"
                    >
                      <Checkbox
                        checked={selectAll}
                        className="size-5 group-hover:border-primary cursor-pointer"
                      />
                      <Label>Select all in list ({filtered.length})</Label>
                    </div>
                  )}
                  {filtered.map((item, index) => (
                    <div
                      className="group flex items-center cusror-pointer rounded-lg p-2 gap-2 dark:hover:border-primary hover:border-primary outline-none hover:bg-primary/10 hover:text-primary cursor-pointer focus-visible:border-none focus-visible:ring-0"
                      key={index}
                      onClick={() => toggle(item)}
                    >
                      {operatorWithCheckbox && (
                        <Checkbox
                          checked={selected.includes(item)}
                          className="size-5 group-hover:border-primary cursor-pointer"
                        />
                      )}
                      <Label>{item}</Label>
                    </div>
                  ))}
                </React.Fragment>
              ) : (
                <div className="w-full h-36 flex items-center justify-center">
                  <Spinner />
                </div>
              )}
            </div>
          </div>
          <Button
            disabled={selected.length === 0 && !search}
            className={cn(
              "rounded-b-lg rounded-t-none h-12",
              "disabled:opacity-100 disabled:text-neutral-400 dark:disabled:text-neutral-300",
            )}
            onClick={commitValues}
          >
            Add
          </Button>
        </PopoverContent>
      </Popover>
      <DataTypeSelector
        id={rule.id}
        field={allProps.field}
        inputType={ruleType}
      />
    </div>
  );
};

export default React.memo(TextValueEditor);
