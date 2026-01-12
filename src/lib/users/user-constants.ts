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

export const FIELD_DESCRIPTIONS: Record<string, string> = {
  name: "The full name of the user.",
  age: "The age of the user.",
  address: "The user's address.",
  phone: "The user's phone number.",
  email: "The user's email address.",
  twitter: "The user's twitter",
  isDev: "The user's position",
  createdAt: "The time that the profile was created",
  birthdate: "The user's birthdate",
};
