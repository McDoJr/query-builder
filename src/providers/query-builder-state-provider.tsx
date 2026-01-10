"use client";

import { useQueryActions } from "@/hooks/use-query-actions";
import { defaultFields } from "@/lib/query/fields";
import { FieldRow, FieldRowAction, RuleRef } from "@/types/types";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Field,
  generateID,
  InputType,
  RuleGroupTypeIC,
} from "react-querybuilder";

type PopoverState = { id: string; open: boolean };

type QueryBuilderState = {
  // fields: FieldFor<User>[];
  fields: Field[];
  query: RuleGroupTypeIC;
  popovers: PopoverState[];
};

type QueryBuilderActions = {
  // setFields: Dispatch<SetStateAction<FieldFor<User>[]>>;
  setFields: Dispatch<SetStateAction<Field[]>>;
  setPopovers: Dispatch<SetStateAction<PopoverState[]>>;
  updatePopoverByGroupID: (groupId: string | undefined, open: boolean) => void;
  setQuery: Dispatch<SetStateAction<RuleGroupTypeIC>>;
  // updateField: (
  //   ruleId: string,
  //   name: string,
  //   type: InputType,
  //   action: FieldRowAction,
  // ) => void;
};

export const QueryBuilderStateContext = createContext<QueryBuilderState | null>(
  null,
);

export const QueryBuilderActionsContext =
  createContext<QueryBuilderActions | null>(null);

export function useQueryBuilderState() {
  const ctx = useContext(QueryBuilderStateContext);
  if (!ctx) {
    throw new Error(
      "useQueryBuilderState must be used within <QueryBuilderStateProvider>",
    );
  }
  return ctx;
}

export function useQueryBuilderActions() {
  const ctx = useContext(QueryBuilderActionsContext);
  if (!ctx) {
    throw new Error(
      "useQueryBuilderActions must be used within <QueryBuilderStateProvider>",
    );
  }
  return ctx;
}

export default function QueryBuilderStateProvider({
  children,
}: PropsWithChildren) {
  const { restoreQueryFromUrl } = useQueryActions();
  const [query, setQuery] = useState<RuleGroupTypeIC>({
    rules: [
      {
        id: generateID(),
        rules: [],
      },
    ],
  });
  const [fields, setFields] = useState<Field[]>(defaultFields);
  const [popovers, setPopovers] = useState<PopoverState[]>([]);
  const modifiedRule = useRef<RuleRef>(null);

  useEffect(() => {
    restoreQueryFromUrl(setQuery);
  }, []);

  const state = useMemo(
    () => ({ fields, popovers, query }),
    [fields, popovers, query],
  );

  function updatePopoverByGroupID(groupId: string | undefined, open: boolean) {
    setPopovers((prev) => {
      if (!groupId) return [...prev];

      const exists = prev.some((p) => p.id === groupId);

      if (!exists) {
        // add if not exists
        return [...prev, { id: groupId, open }];
      }

      // update if exists
      return prev.map((p) => (p.id === groupId ? { ...p, open } : p));
    });
  }

  const actions = useMemo(
    () => ({
      setFields,
      setPopovers,
      updatePopoverByGroupID,
      setQuery,
    }),
    [],
  );

  return (
    <QueryBuilderStateContext.Provider value={state}>
      <QueryBuilderActionsContext.Provider value={actions}>
        {children}
      </QueryBuilderActionsContext.Provider>
    </QueryBuilderStateContext.Provider>
  );
}
