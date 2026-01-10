import { Field } from "react-querybuilder";
import { getIcon } from "./icons";

export const defaultFields: Field[] = [
  {
    name: "name",
    label: "Name",
    inputType: "text",
    placeholder: "Value...",
    rows: [],
  },
  {
    name: "age",
    label: "Age",
    inputType: "number",
    placeholder: "Value...",
    rows: [],
  },
  {
    name: "address",
    label: "Address",
    inputType: "text",
    placeholder: "Value...",
    rows: [],
  },
  {
    name: "phone",
    label: "Phone",
    inputType: "text",
    placeholder: "Value...",
    rows: [],
  },
  {
    name: "email",
    label: "Email",
    inputType: "text",
    placeholder: "Value...",
    validator: ({ value }) => /^[^@]+@[^@]+/.test(value),
    rows: [],
  },
  {
    name: "twitter",
    label: "Twitter",
    inputType: "text",
    placeholder: "Value...",
    rows: [],
  },
  {
    name: "isDev",
    label: "Is a Developer?",
    placeholder: "Value...",
    valueEditorType: "checkbox",
    defaultValue: false,
    rows: [],
  },
  {
    name: "createdAt",
    label: "Created",
    inputType: "date",
    placeholder: "Value...",
    rows: [],
  },
  {
    name: "birthdate",
    label: "Birthdate",
    inputType: "date",
    placeholder: "Value...",
    rows: [],
  },
];

export function getField(fields: Field[], value?: string) {
  const fieldKeys = getFieldKeys(fields);
  return fieldKeys.find((f) => f.name === value);
}

export function getFieldKeys(fields: Field[]) {
  return fields
    .filter((f) => f.name !== "isDev" && f.name !== "birthdate")
    .map((f) => ({
      ...f,
      icon: getIcon(f.inputType as string),
    }));
}
