import { isString, isArray } from "./Misc.js";

export function splitList(value) {
  return isString(value) ? value.split(/,\s*|\s+/)
    : isArray(value)  ? value
    : [value];
};

export function joinList(array, joint=' ', lastJoint=joint) {
  let copy = [...array];
  const last = copy.pop();
  return copy.length
    ? [copy.join(joint), last].join(lastJoint)
    : last;
};

export function joinListAnd(array, joint=', ', lastJoint=' and ') {
  return joinList(array, joint, lastJoint);
};

export function joinListOr(array, joint=', ', lastJoint=' or ') {
  return joinList(array, joint, lastJoint);
};

export function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function snakeUp(uri) {
  return uri.split('/').map(
    // each segment can be like foo_bar which we convert to FooBar
    segment => segment.split('_').map(capitalise).join('')
  ).join('/');
}
