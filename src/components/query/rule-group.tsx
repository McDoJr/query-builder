import type {
  ActionElementEventHandler,
  Classnames,
  Path,
  RuleGroupType,
  RuleGroupTypeAny,
  RuleGroupTypeIC,
  ValidationResult,
  ValueChangeEventHandler,
} from "@react-querybuilder/core";
import {
  clsx,
  getFirstOption,
  getOption,
  getParentPath,
  getValidationClassNames,
  isRuleGroup,
  isRuleGroupType,
  pathsAreEqual,
  standardClassnames,
  TestID,
} from "@react-querybuilder/core";
import { GripVertical, Plus } from "lucide-react";
import type { MouseEvent } from "react";
import * as React from "react";
import { useCallback, useMemo } from "react";
import type { RuleGroupProps } from "react-querybuilder";
import {
  useDeprecatedProps,
  usePathsMemo,
  useReactDndWarning,
  useStopEventPropagation,
} from "react-querybuilder";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  useQueryBuilderActions,
  useQueryBuilderState,
} from "@/providers/query-builder-state-provider";
import { getBeforeAfterCombinators } from "@/lib/query/rules";

/**
 * This component was extracted from the react-querybuilder repository
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
              <PopoverContent align="start" className="p-1">
                <div
                  ref={rg.dropRef}
                  className={cn(rg.classNames.header, "p-1")}
                >
                  <RuleGroupHeaderElements {...rg} {...actions} />
                </div>
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

/* oxlint-disable typescript/no-explicit-any */
export interface UseRuleGroup extends RuleGroupProps {
  addGroup: ActionElementEventHandler;
  addRule: ActionElementEventHandler;
  accessibleDescription: string;
  muted?: boolean;
  classNames: Pick<
    { [k in keyof Classnames]: string },
    | "header"
    | "shiftActions"
    | "dragHandle"
    | "combinators"
    | "notToggle"
    | "addRule"
    | "addGroup"
    | "cloneGroup"
    | "lockGroup"
    | "muteGroup"
    | "removeGroup"
    | "body"
  >;
  cloneGroup: ActionElementEventHandler;
  onCombinatorChange: ValueChangeEventHandler;
  onGroupAdd: (
    group: RuleGroupTypeAny,
    parentPath: Path,
    context?: any,
  ) => void;
  onIndependentCombinatorChange: (
    value: any,
    index: number,
    context?: any,
  ) => void;
  onNotToggleChange: (checked: boolean, context?: any) => void;
  outerClassName: string;
  pathsMemo: { path: Path; disabled: boolean }[];
  removeGroup: ActionElementEventHandler;
  ruleGroup: RuleGroupType | RuleGroupTypeIC;
  shiftGroupDown: (event?: MouseEvent, context?: any) => void;
  shiftGroupUp: (event?: MouseEvent, context?: any) => void;
  toggleLockGroup: ActionElementEventHandler;
  toggleMuteGroup: ActionElementEventHandler;
  validationClassName: string;
  validationResult: boolean | ValidationResult;
}
/* oxlint-enable typescript/no-explicit-any */

/**
 * Prepares all values and methods used by the {@link RuleGroup} component.
 *
 * @group Hooks
 */
export const useRuleGroup = (props: RuleGroupProps): UseRuleGroup => {
  const {
    id,
    path,
    ruleGroup: ruleGroupProp,
    schema: {
      qbId,
      accessibleDescriptionGenerator,
      classNames: classNamesProp,
      combinators,
      createRule,
      createRuleGroup,
      disabledPaths,
      independentCombinators,
      validationMap,
      enableDragAndDrop,
      getRuleGroupClassname,
      suppressStandardClassnames,
    },
    actions: { onGroupAdd, onGroupRemove, onPropChange, onRuleAdd, moveRule },
    disabled: disabledProp,
    parentDisabled,
    parentMuted,
    shiftUpDisabled,
    shiftDownDisabled,
    combinator: combinatorProp,
    rules: rulesProp,
    not: notProp,
    // Drag-and-drop
    dropEffect = "move",
    groupItems = false,
    dragMonitorId = "",
    dropMonitorId = "",
    previewRef = null,
    dragRef = null,
    dropRef = null,
    isDragging = false,
    isOver = false,
    dropNotAllowed = false,
  } = props;

  useDeprecatedProps("ruleGroup", !ruleGroupProp);

  useReactDndWarning(
    enableDragAndDrop,
    !!(dragMonitorId || dropMonitorId || previewRef || dragRef || dropRef),
  );

  const disabled = !!parentDisabled || !!disabledProp;
  const muted = !!parentMuted || !!ruleGroupProp?.muted;

  const combinator = useMemo(
    () =>
      ruleGroupProp && isRuleGroupType(ruleGroupProp)
        ? ruleGroupProp.combinator
        : ruleGroupProp
          ? getFirstOption(combinators)!
          : (combinatorProp ?? getFirstOption(combinators)!),
    [combinatorProp, combinators, ruleGroupProp],
  );

  // TODO?: Type this properly with generics
  const ruleGroup = useMemo((): RuleGroupTypeAny => {
    if (ruleGroupProp) {
      if (ruleGroupProp.combinator === combinator || independentCombinators) {
        return ruleGroupProp;
      }
      const newRG = structuredClone(ruleGroupProp);
      newRG.combinator = combinator;
      return newRG;
    }
    return { rules: rulesProp, not: notProp } as RuleGroupTypeIC;
  }, [combinator, independentCombinators, notProp, ruleGroupProp, rulesProp]);

  const classNames = useMemo(
    () => ({
      header: clsx(
        suppressStandardClassnames || standardClassnames.header,
        classNamesProp.header,
        isOver && dropEffect === "copy" && classNamesProp.dndCopy,
        dropNotAllowed && classNamesProp.dndDropNotAllowed,
        suppressStandardClassnames || {
          [standardClassnames.dndOver]: isOver,
          [standardClassnames.dndCopy]: isOver && dropEffect === "copy",
          [standardClassnames.dndDropNotAllowed]: dropNotAllowed,
        },
      ),
      shiftActions: clsx(
        suppressStandardClassnames || standardClassnames.shiftActions,
        classNamesProp.shiftActions,
      ),
      dragHandle: clsx(
        suppressStandardClassnames || standardClassnames.dragHandle,
        classNamesProp.dragHandle,
      ),
      combinators: clsx(
        suppressStandardClassnames || standardClassnames.combinators,
        classNamesProp.valueSelector,
        classNamesProp.combinators,
      ),
      notToggle: clsx(
        suppressStandardClassnames || standardClassnames.notToggle,
        classNamesProp.notToggle,
      ),
      addRule: clsx(
        suppressStandardClassnames || standardClassnames.addRule,
        classNamesProp.actionElement,
        classNamesProp.addRule,
      ),
      addGroup: clsx(
        suppressStandardClassnames || standardClassnames.addGroup,
        classNamesProp.actionElement,
        classNamesProp.addGroup,
      ),
      cloneGroup: clsx(
        suppressStandardClassnames || standardClassnames.cloneGroup,
        classNamesProp.actionElement,
        classNamesProp.cloneGroup,
      ),
      lockGroup: clsx(
        suppressStandardClassnames || standardClassnames.lockGroup,
        classNamesProp.actionElement,
        classNamesProp.lockGroup,
      ),
      muteGroup: clsx(
        suppressStandardClassnames || standardClassnames.muteGroup,
        classNamesProp.actionElement,
        classNamesProp.muteGroup,
      ),
      removeGroup: clsx(
        suppressStandardClassnames || standardClassnames.removeGroup,
        classNamesProp.actionElement,
        classNamesProp.removeGroup,
      ),
      body: clsx(
        suppressStandardClassnames || standardClassnames.body,
        classNamesProp.body,
      ),
    }),
    [
      classNamesProp.actionElement,
      classNamesProp.addGroup,
      classNamesProp.addRule,
      classNamesProp.body,
      classNamesProp.cloneGroup,
      classNamesProp.combinators,
      classNamesProp.dndCopy,
      classNamesProp.dndDropNotAllowed,
      classNamesProp.dragHandle,
      classNamesProp.header,
      classNamesProp.lockGroup,
      classNamesProp.muteGroup,
      classNamesProp.notToggle,
      classNamesProp.removeGroup,
      classNamesProp.shiftActions,
      classNamesProp.valueSelector,
      dropEffect,
      dropNotAllowed,
      isOver,
      suppressStandardClassnames,
    ],
  );

  const onCombinatorChange: ValueChangeEventHandler = useCallback(
    (value) => {
      if (!disabled) {
        onPropChange("combinator", value, path);
      }
    },
    [disabled, onPropChange, path],
  );

  const onIndependentCombinatorChange = useCallback(
    // oxlint-disable-next-line typescript/no-explicit-any
    (value: any, index: number, _context?: any) => {
      if (!disabled) {
        onPropChange("combinator", value, [...path, index]);
      }
    },
    [disabled, onPropChange, path],
  );

  const onNotToggleChange = useCallback(
    // oxlint-disable-next-line typescript/no-explicit-any
    (checked: boolean, _context?: any) => {
      if (!disabled) {
        onPropChange("not", checked, path);
      }
    },
    [disabled, onPropChange, path],
  );

  const addRule: ActionElementEventHandler = useCallback(
    (_e, context) => {
      if (!disabled) {
        const newRule = createRule();
        onRuleAdd(newRule, path, context);
      }
    },
    [createRule, disabled, onRuleAdd, path],
  );

  const addGroup: ActionElementEventHandler = useCallback(
    (_e, context) => {
      if (!disabled) {
        const newGroup = createRuleGroup();
        onGroupAdd(newGroup, path, context);
      }
    },
    [createRuleGroup, disabled, onGroupAdd, path],
  );

  const cloneGroup: ActionElementEventHandler = useCallback(() => {
    if (!disabled) {
      const newPath = [...getParentPath(path), path.at(-1)! + 1];
      moveRule(path, newPath, true);
    }
  }, [disabled, moveRule, path]);

  const shiftGroupUp = useCallback(
    // oxlint-disable-next-line typescript/no-explicit-any
    (event?: MouseEvent, _context?: any) => {
      if (!disabled && !shiftUpDisabled) {
        moveRule(path, "up", event?.altKey);
      }
    },
    [disabled, moveRule, path, shiftUpDisabled],
  );

  const shiftGroupDown = useCallback(
    // oxlint-disable-next-line typescript/no-explicit-any
    (event?: MouseEvent, _context?: any) => {
      if (!disabled && !shiftDownDisabled) {
        moveRule(path, "down", event?.altKey);
      }
    },
    [disabled, moveRule, path, shiftDownDisabled],
  );

  const toggleLockGroup: ActionElementEventHandler = useCallback(() => {
    onPropChange("disabled", !disabled, path);
  }, [disabled, onPropChange, path]);

  const toggleMuteGroup: ActionElementEventHandler = useCallback(() => {
    onPropChange("muted", !ruleGroup.muted, path);
  }, [ruleGroup.muted, onPropChange, path]);

  const removeGroup: ActionElementEventHandler = useCallback(() => {
    if (!disabled) {
      onGroupRemove(path);
    }
  }, [disabled, onGroupRemove, path]);

  const validationResult = validationMap[id ?? /* istanbul ignore next */ ""];
  const validationClassName = useMemo(
    () => getValidationClassNames(validationResult),
    [validationResult],
  );
  const combinatorBasedClassName = useMemo(
    () =>
      independentCombinators
        ? null
        : (getOption(combinators, combinator)?.className ?? ""),
    [combinator, combinators, independentCombinators],
  );

  const ruleGroupClassname = useMemo(
    () => getRuleGroupClassname(ruleGroup),
    [getRuleGroupClassname, ruleGroup],
  );

  const outerClassName = useMemo(
    () =>
      clsx(
        ruleGroupClassname,
        combinatorBasedClassName,
        suppressStandardClassnames || standardClassnames.ruleGroup,
        classNamesProp.ruleGroup,
        disabled && classNamesProp.disabled,
        muted && classNamesProp.muted,
        isDragging && classNamesProp.dndDragging,
        isOver && groupItems && classNamesProp.dndGroup,
        suppressStandardClassnames || {
          [standardClassnames.disabled]: disabled,
          [standardClassnames.muted]: muted,
          [standardClassnames.dndDragging]: isDragging,
          [standardClassnames.dndGroup]: isOver && groupItems,
        },
        validationClassName,
      ),
    [
      classNamesProp.disabled,
      classNamesProp.muted,
      classNamesProp.dndDragging,
      classNamesProp.dndGroup,
      classNamesProp.ruleGroup,
      combinatorBasedClassName,
      disabled,
      muted,
      groupItems,
      isDragging,
      isOver,
      ruleGroupClassname,
      suppressStandardClassnames,
      validationClassName,
    ],
  );

  const pathsMemo = usePathsMemo({
    disabled,
    disabledPaths,
    path,
    nestedArray: ruleGroup.rules,
  });

  const accessibleDescription = useMemo(
    () => accessibleDescriptionGenerator({ path, qbId }),
    [accessibleDescriptionGenerator, path, qbId],
  );

  return {
    ...props,
    addGroup,
    addRule,
    accessibleDescription,
    classNames,
    cloneGroup,
    combinator,
    disabled,
    dragMonitorId,
    dragRef,
    dropMonitorId,
    dropRef,
    isDragging,
    isOver,
    muted,
    onCombinatorChange,
    onGroupAdd,
    onIndependentCombinatorChange,
    onNotToggleChange,
    outerClassName,
    parentDisabled,
    pathsMemo,
    previewRef,
    removeGroup,
    ruleGroup,
    shiftGroupUp,
    shiftGroupDown,
    toggleLockGroup,
    toggleMuteGroup,
    validationClassName,
    validationResult,
  };
};
