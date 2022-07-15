import { hasValue, fail } from "./Misc.js";
import { joinListOr, splitList } from "./Text.js";

export function requiredParam(params={}, name) {
  const value = params[name];
  if (hasValue(value)) {
    return value;
  }
  else {
    fail("Missing value for required parameter: ", name);
  }
}

export function requiredParams(params={}, names) {
  return splitList(names).map( name => requiredParam(params, name) );
}

export function allParams(...args) {
  return requiredParams(...args);
}

export function anyParams(params, names) {
  let found = false;
  const nlist  = splitList(names);
  const values = nlist.map(
    name => {
      const value = params[name];
      if (hasValue(value)) {
        found = true;
      }
      return value;
    }
  );
  return found
    ? values
    : fail("Missing value for one of: ", joinListOr(nlist));
}
