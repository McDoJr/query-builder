import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  calculateDateRange,
  getInferedDefaultValue,
  inferValueFromRange,
  isAfter,
} from "@/lib/date";
import { DateRangeUnit } from "@/types/types";

type Calendar23Props = React.ComponentProps<"button"> & {
  defaultRangeValue: DateRange | undefined;
  commitDateRange: (range: DateRange | undefined, unit?: DateRangeUnit) => void;
  withHeader?: boolean;
  operator: string;
  unit?: DateRangeUnit;
};

export default function Calendar23({
  defaultRangeValue,
  commitDateRange,
  withHeader = false,
  operator,
  unit: defaultUnit,
}: Calendar23Props) {
  const [unit, setUnit] = React.useState<DateRangeUnit>(defaultUnit ?? "days");
  const [value, setValue] = React.useState<string>(
    getInferedDefaultValue(withHeader, defaultRangeValue, unit, operator),
  );
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>(
    defaultRangeValue,
  );

  // to track where the changes came from
  const lastChangeSource = React.useRef<"header" | "calendar" | null>(null);

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Sync value and rage
  React.useEffect(() => {
    const numericValue = Number(value);
    if (!withHeader || !numericValue || numericValue <= 0) return;

    if (lastChangeSource.current === "calendar") return;

    const newRange = calculateDateRange(operator, numericValue, unit);
    setRange(newRange);
  }, [value, unit, operator]);

  // keep defaultRangeValue and range sync upon field/operator changes (due to resetOnOperatorChange & resetOnFieldChange being enabled)
  React.useEffect(() => {
    setRange(defaultRangeValue);
  }, [defaultRangeValue]);

  // Reset when cancelled or close on blur
  const reset = () => {
    setRange(defaultRangeValue);
    setOpen(false);
    if (withHeader) {
      setValue(
        getInferedDefaultValue(withHeader, defaultRangeValue, unit, operator),
      );
    }
  };

  function getTextValue() {
    if (withHeader && value) return `${value} ${unit}`;
    return range?.from && range?.to
      ? `${formatDate(range.from)} - ${formatDate(range.to)}`
      : "Select date";
  }

  // value handler from input
  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    lastChangeSource.current = "header";
    if (val === "") {
      setValue("");
      return;
    }

    if (!/^\d+$/.test(val)) return;

    setValue(val);
  }

  function onDateSelect(nextRange: DateRange | undefined) {
    setRange(nextRange);
    if (!nextRange?.from || !nextRange?.to || !withHeader) return;

    let from = nextRange.from;
    let to = nextRange.to;

    lastChangeSource.current = "calendar";

    if (operator === "last") {
      from = today;
      to = nextRange.to;

      // if operator is "last" and the clicked to date is > today, then make the from = today
      if (isAfter(to, today)) {
        const inferred = inferValueFromRange({ from, to }, unit, operator);

        if (inferred && Number.isInteger(inferred)) {
          setValue(String(-Math.abs(inferred)));
        }

        setRange({ from, to });
        return;
      }
    }

    const inferred = inferValueFromRange(nextRange, unit, operator);

    if (inferred && Number.isInteger(inferred)) {
      setValue(String(inferred - 1));
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Popover
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) reset();
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-56 justify-between border font-normal group text-sm rounded-sm bg-table-header dark:bg-table-header border-table-header dark:hover:border-primary hover:border-primary outline-none hover:bg-primary/10 hover:text-primary cursor-pointer focus-visible:border-none focus-visible:ring-0"
          >
            {getTextValue()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Card className="border-none p-0">
            <CardContent className="border-none flex p-0 flex-col gap-3">
              {withHeader && (
                <div className="p-4 pb-0 flex items-center gap-2">
                  <Input
                    value={value}
                    onChange={handleValueChange}
                    className="w-26 rounded-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        commitDateRange(range, withHeader ? unit : undefined);
                        setOpen(false);
                      }
                    }}
                  />
                  <Select
                    value={unit}
                    onValueChange={(v: DateRangeUnit) => {
                      lastChangeSource.current = "header";
                      setUnit(v);
                    }}
                  >
                    <SelectTrigger className=" rounded-sm w-26">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" align="start">
                      {["days", "weeks", "months"].map((item) => (
                        <SelectItem value={item} key={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Calendar
                mode="range"
                selected={range}
                captionLayout="dropdown"
                onSelect={onDateSelect}
                footer={
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <Button variant="ghost" onClick={reset}>
                      Cancel
                    </Button>
                    <Button
                      className="text-foreground"
                      size="sm"
                      onClick={() => {
                        setOpen(false);
                        commitDateRange(range, withHeader ? unit : undefined);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
