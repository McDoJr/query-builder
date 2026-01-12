import type { RuleGroupType, RuleGroupTypeIC } from "@react-querybuilder/core";
import { isRuleGroup, pathsAreEqual, TestID } from "@react-querybuilder/core";
import { GripVertical, Plus } from "lucide-react";
import * as React from "react";
import { useMemo } from "react";
import type { RuleGroupProps, UseRuleGroup } from "react-querybuilder";
import { useRuleGroup, useStopEventPropagation } from "react-querybuilder";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  useQueryBuilderActions,
  useQueryBuilderState,
} from "@/providers/query-builder-state-provider";
import { getBeforeAfterCombinators } from "@/lib/query/rules";

/**
 * This component was extracted from the react-querybuilder repository and was modified
 */

/**
 * Default component to display {@link RuleGroupType} and {@link RuleGroupTypeIC}
 * objects. This is actually a small wrapper around {@link RuleGroupHeaderComponents}
 * and {@link RuleGroupBodyComponents}.
 *
 * @group Components
 */

export const RuleGroup: React.MemoExoticComponent<
  (props: RuleGroupProps) => React.JSX.Element
> = React.memo(function RuleGroup({ ...props }: RuleGroupProps) {
  const rg = useRuleGroup(props);
  const { popovers, query } = useQueryBuilderState();
  const { updatePopoverByGroupID } = useQueryBuilderActions();

  const popover = useMemo(
    () => popovers.find((p) => p.id === rg.id),
    [popovers, rg.id],
  );

  const isOpen = popover?.open ?? false;

  const {
    schema: {
      controls: {
        ruleGroupBodyElements: RuleGroupBodyElements,
        ruleGroupHeaderElements: RuleGroupHeaderElements,
      },
    },
  } = rg;

  const addRule = useStopEventPropagation(rg.addRule);
  const addGroup = useStopEventPropagation(rg.addGroup);
  const cloneGroup = useStopEventPropagation(rg.cloneGroup);
  const toggleLockGroup = useStopEventPropagation(rg.toggleLockGroup);
  const toggleMuteGroup = useStopEventPropagation(rg.toggleMuteGroup);
  const removeGroup = useStopEventPropagation(rg.removeGroup);
  const shiftGroupUp = useStopEventPropagation(rg.shiftGroupUp);
  const shiftGroupDown = useStopEventPropagation(rg.shiftGroupDown);

  const actions = useMemo(
    () => ({
      addRule,
      addGroup,
      cloneGroup,
      toggleLockGroup,
      toggleMuteGroup,
      removeGroup,
      shiftGroupUp,
      shiftGroupDown,
    }),
    [
      addRule,
      addGroup,
      cloneGroup,
      toggleLockGroup,
      toggleMuteGroup,
      removeGroup,
      shiftGroupUp,
      shiftGroupDown,
    ],
  );

  const isSubGroup = rg.path.length > 0;
  const index = props.path.at(-1);

  const combinators = getBeforeAfterCombinators(query.rules, index);

  const isRoundedTopBorder = index === 0 || combinators.before === "or";
  const isRoundedBottomBorder =
    combinators.after === "or" || index === query.rules.length - 1;

  return (
    <div
      ref={rg.previewRef}
      title={rg.accessibleDescription}
      className={
        // Controls the group borders
        isSubGroup
          ? cn(
              "flex border m-0",
              isRoundedTopBorder ? "rounded-t-lg" : "border-t-[0.5px]",
              isRoundedTopBorder && combinators.before && "mt-5",
              isRoundedBottomBorder && "rounded-b-lg",
              isRoundedBottomBorder && combinators.after && "mb-5",
            )
          : undefined
      }
      data-testid={TestID.ruleGroup}
      data-not={rg.ruleGroup.not ? "true" : undefined}
      data-dragmonitorid={rg.dragMonitorId}
      data-dropmonitorid={rg.dropMonitorId}
      data-rule-group-id={rg.id}
      data-level={rg.path.length}
      data-path={JSON.stringify(rg.path)}
    >
      <p>{!isSubGroup && ""}</p>
      <div className={isSubGroup ? "p-4" : undefined}>
        {isSubGroup && (
          <div className="flex items-center gap-2 mb-2">
            <GripVertical
              size={12}
              className="text-muted-foreground cursor-grab"
            />
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              All Users
            </p>
          </div>
        )}
        <div className={cn("flex flex-col gap-2", isSubGroup && "px-5")}>
          <RuleGroupBodyElements {...rg} {...actions} />
          {isSubGroup && (
            <Popover
              open={isOpen}
              onOpenChange={(open) => updatePopoverByGroupID(rg.id, open)}
            >
              <PopoverTrigger asChild className="self-start">
                <Button variant="ghost" title="">
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      rg.ruleGroup.rules.length && "px-8",
                    )}
                  >
                    <Plus />
                    Filter
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-2 w-96">
                <RuleGroupHeaderElements {...rg} {...actions} />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
});

/**
 * Renders a `React.Fragment` containing an array of either (1) {@link Rule} and
 * {@link RuleGroup}, or (2) {@link Rule}, {@link RuleGroup}, and {@link InlineCombinator}.
 *
 * @group Components
 */

export const RuleGroupBodyComponents: React.MemoExoticComponent<
  (rg: UseRuleGroup) => React.JSX.Element
> = React.memo(function RuleGroupBodyComponents(rg: UseRuleGroup) {
  const {
    schema: {
      controls: {
        combinatorSelector: CombinatorSelectorControlElement,
        inlineCombinator: InlineCombinatorControlElement,
        ruleGroup: RuleGroupControlElement,
        rule: RuleControlElement,
      },
    },
  } = rg;

  return (
    <div className="flex flex-col">
      {rg.ruleGroup.rules.map((r, idx) => {
        const pathMemo = rg.pathsMemo[idx];
        const path = pathMemo.path;
        const disabled =
          pathMemo.disabled || (typeof r !== "string" && r.disabled);

        const shiftUpDisabled = pathsAreEqual([0], path);
        const shiftDownDisabled =
          rg.path.length === 0 && idx === rg.ruleGroup.rules.length - 1;

        const combinator =
          rg.schema.independentCombinators && idx > 0
            ? (rg.ruleGroup.rules[idx - 1] as string | undefined)
            : undefined;

        if (isRuleGroup(r)) {
          return (
            <div key={r.id} className="relative">
              {idx > 0 && (
                <div className="w-16 flex justify-center absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Button
                    variant={combinator === "and" ? "default" : "ghost"}
                    className={cn(
                      rg.classNames.combinators,
                      "uppercase font-semibold text-xs h-7",
                      combinator === "or" && "bg-muted",
                    )}
                    onClick={() =>
                      rg.onIndependentCombinatorChange(
                        combinator === "and" ? "or" : "and",
                        idx - 1,
                      )
                    }
                  >
                    {combinator}
                  </Button>
                </div>
              )}

              <RuleGroupControlElement
                id={r.id}
                schema={rg.schema}
                actions={rg.actions}
                path={path}
                translations={rg.translations}
                ruleGroup={r}
                rules={r.rules}
                combinator={r.combinator}
                not={!!r.not}
                disabled={disabled}
                parentDisabled={rg.parentDisabled || rg.disabled}
                parentMuted={rg.parentMuted || rg.muted}
                shiftUpDisabled={shiftUpDisabled}
                shiftDownDisabled={shiftDownDisabled}
                context={rg.context}
              />
            </div>
          );
        }

        if (typeof r === "string") {
          return null;
        }

        return (
          <div key={r.id} className="flex items-center gap-2 mt-2">
            {idx === 0 ? (
              <p className="w-16 h-9 p-2 px-2.5 rounded-sm text-muted-foreground flex items-center justify-end text-sm">
                where
              </p>
            ) : (
              rg.schema.independentCombinators && (
                <div className="w-16 flex justify-end">
                  <InlineCombinatorControlElement
                    options={rg.schema.combinators}
                    value={combinator}
                    handleOnChange={(val) =>
                      rg.onIndependentCombinatorChange(val, idx - 1)
                    }
                    rules={rg.ruleGroup.rules}
                    level={rg.path.length}
                    context={rg.context}
                    validation={rg.validationResult}
                    component={CombinatorSelectorControlElement}
                    path={path}
                    disabled={disabled}
                    schema={rg.schema}
                    ruleGroup={rg.ruleGroup}
                  />
                </div>
              )
            )}

            {/* RULE */}
            <RuleControlElement
              id={r.id}
              rule={r}
              field={r.field}
              operator={r.operator}
              value={r.value}
              valueSource={r.valueSource}
              schema={rg.schema}
              actions={rg.actions}
              path={path}
              disabled={disabled}
              parentDisabled={rg.parentDisabled || rg.disabled}
              parentMuted={rg.parentMuted || rg.muted}
              translations={rg.translations}
              shiftUpDisabled={shiftUpDisabled}
              shiftDownDisabled={shiftDownDisabled}
              context={rg.context}
            />
          </div>
        );
      })}
    </div>
  );
});
