export function isString(value) {
  return typeof value === 'string';
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isFunction(value) {
  return typeof value === 'function'
}

export function isObject(value) {
  return typeof value === "object"
    && ! isArray(value)
    && ! isNull(value);
}

export function isUndefined(v) {
  return typeof v === 'undefined';
};

export function isNull(v) {
  return v === null;
};

export function hasValue(v) {
  return ! (isUndefined(v) || isNull(v));
}

export function haveValue(...args) {
    return args.every( arg => hasValue(arg) );
}

export function noValue(v) {
  return ! hasValue(v);
}

export function fail(...args) {
  throw new Error(args.join(''));
}
