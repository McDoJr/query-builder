import jsonLogic from "json-logic-js";

let registered = false;

export function registerJsonLogicOperators() {
  if (registered) return;
  registered = true;
  jsonLogic.add_operation("isNumeric", (value: any) => {
    if (value === null || value === undefined) return false;
    return !isNaN(Number(value));
  });

  jsonLogic.add_operation("isNotNumeric", (value: any) => {
    if (value === null || value === undefined) return true;
    return isNaN(Number(value));
  });
}

export function evalJsonLogic(rule: any, data: any) {
  return jsonLogic.apply(rule, data);
}
