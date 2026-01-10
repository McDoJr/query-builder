import { Field } from "react-querybuilder";
import { getIcon } from "./icons";

export const defaultFields: Field[] = [
  {
    name: "name",
    label: "Name",
    inputType: "text",
    placeholder: "Value...",
  },
  {
    name: "age",
    label: "Age",
    inputType: "number",
    placeholder: "Value...",
  },
  {
    name: "address",
    label: "Address",
    inputType: "text",
    placeholder: "Value...",
  },
  {
    name: "phone",
    label: "Phone",
    inputType: "text",
    placeholder: "Value...",
  },
  {
    name: "email",
    label: "Email",
    inputType: "text",
    placeholder: "Value...",
    validator: ({ value }) => /^[^@]+@[^@]+/.test(value),
  },
  {
    name: "twitter",
    label: "Twitter",
    inputType: "text",
    placeholder: "Value...",
  },
  {
    name: "isDev",
    label: "Is a Developer?",
    placeholder: "Value...",
    valueEditorType: "checkbox",
    defaultValue: false,
  },
  {
    name: "createdAt",
    label: "Created",
    inputType: "date",
    placeholder: "Value...",
  },
  {
    name: "birthdate",
    label: "Birthdate",
    inputType: "date",
    placeholder: "Value...",
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
