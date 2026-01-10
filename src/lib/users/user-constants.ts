export const FIELD_TYPES: Record<string, string> = {
  name: "text",
  age: "number",
  address: "text",
  phone: "text",
  email: "text",
  twitter: "text",
  isDev: "checkbox",
  createdAt: "date",
  birthdate: "date",
};

export const OPTIONS = {
  searchableFields: ["name", "email", "address", "phone"],
  sortableFields: [
    "name",
    "age",
    "email",
    "address",
    "phone",
    "createdAt",
    "birthdate",
  ],
};
