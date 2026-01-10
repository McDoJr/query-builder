"use client";

import { useMemo, useState } from "react";
import {
  Classnames,
  ControlElementsProp,
  isRuleGroup,
  QueryBuilder,
  RuleGroupTypeAny,
  RuleGroupTypeIC,
} from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { defaultOperators, getOperators } from "@/lib/query/operators";
import { FieldSelector } from "./query/field-selector";
import { CombinatorSelector } from "./query/combinator-selector";
import { ValueEditor } from "./query/value-editor";
import { RuleGroup, RuleGroupBodyComponents } from "./query/rule-group";
import { AddRuleButtons, onAddRule } from "./query/add-rule-buttons";
import RemoveActionElement from "./query/action-element";
import {
  useQueryBuilderActions,
  useQueryBuilderState,
} from "@/providers/query-builder-state-provider";
import { useQueryActions } from "@/hooks/use-query-actions";
import OperatorSelector from "./query/operator-selector";

export default function QueryBuilderClient() {
  const { fields, query } = useQueryBuilderState();
  const { setPopovers, setQuery } = useQueryBuilderActions();
  const { saveQueryToUrl } = useQueryActions();

  const [groupIds, setGroupIds] = useState<string[]>([]);

  const controls = useMemo<{
    elements: ControlElementsProp<any, any>;
    classNames: Partial<Classnames> | undefined;
  }>(
    () => ({
      elements: {
        fieldSelector: FieldSelector,
        operatorSelector: OperatorSelector,
        combinatorSelector: CombinatorSelector,
        valueEditor: ValueEditor,
        removeRuleAction: RemoveActionElement,
        removeGroupAction: null,
        addRuleAction: AddRuleButtons,
        addGroupAction: null,
        ruleGroup: RuleGroup,
        ruleGroupBodyElements: RuleGroupBodyComponents,
      },
      classNames: {
        rule: "flex items-center gap-2",
      },
    }),
    [],
  );

  function normalizeQuery(
    query: RuleGroupTypeIC,
    groupIds: string[],
  ): { query: RuleGroupTypeIC; groupIds: string[] } {
    const rules = query.rules;

    const groups = rules.filter(isRuleGroup) as RuleGroupTypeAny[];

    // Track which group IDs still exist
    const existingGroupIds = groups
      .map((g) => g.id)
      .filter((id): id is string => Boolean(id));

    let nextGroupIds = groupIds.filter((id) => existingGroupIds.includes(id));

    // Add newly touched groups
    groups.forEach((g) => {
      if (g.id && g.rules.length > 0 && !nextGroupIds.includes(g.id)) {
        nextGroupIds.push(g.id);
      }
    });

    // If there's only one subgroup, never remove it
    if (groups.length <= 1) {
      return { query, groupIds: nextGroupIds };
    }

    const removeIndices = new Set<number>();

    rules.forEach((item, idx) => {
      if (!isRuleGroup(item)) return;
      if (!item.id) return;

      const touched = nextGroupIds.includes(item.id);
      const empty = item.rules.length === 0;

      if (!touched || !empty) return;

      // Do not remove the first group if it would be the only one
      const remainingGroups = groups.filter((g) => g.id !== item.id).length;

      if (remainingGroups === 0) return;

      removeIndices.add(idx);

      // Remove adjacent combinator
      if (idx === 0) {
        removeIndices.add(idx + 1);
      } else {
        removeIndices.add(idx - 1);
      }
    });

    if (removeIndices.size === 0) {
      return { query, groupIds: nextGroupIds };
    }

    const cleanedRules = rules.filter((_, idx) => !removeIndices.has(idx));

    return {
      query: {
        ...query,
        rules: cleanedRules,
      } as RuleGroupTypeIC,
      groupIds: nextGroupIds,
    };
  }

  function onQueryChange(q: RuleGroupTypeIC) {
    const { query, groupIds: ids } = normalizeQuery(q, groupIds);
    setQuery(query);
    setPopovers((prevPopovers) =>
      prevPopovers.filter((p) => ids.includes(p.id)),
    );
    setGroupIds(ids);
    saveQueryToUrl(query);
  }

  if (!fields.length) {
    return null;
  }

  return (
    <QueryBuilder
      fields={fields}
      query={query}
      onQueryChange={onQueryChange}
      operators={defaultOperators}
      getOperators={getOperators}
      controlClassnames={controls.classNames}
      onAddRule={onAddRule}
      controlElements={controls.elements}
      showCombinatorsBetweenRules={true}
      enableMountQueryChange={false}
      resetOnOperatorChange={true}
      resetOnFieldChange={true}
    />
  );
}
