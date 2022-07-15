// simple wrapper around JSON load/dump
import yaml from 'js-yaml';
export const decode = text => yaml.load(text);
export const encode = data => yaml.dump(data);
export const codec = { encode, decode };
export default codec
