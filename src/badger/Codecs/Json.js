// simple wrapper around JSON parse/stringify
export const decode = text => JSON.parse(text);
export const encode = data => JSON.stringify(data);
export const codec = { encode, decode };
export default codec
