import { addDebug } from "./Utils/Debug.js";
import { fail, hasValue, isInteger, isObject, isString, noValue } from "./Utils/Misc.js";

const MATCH_DATE  = '(\\d{4})\\D(\\d{1,2})\\D(\\d{1,2})';
const MATCH_TIME  = '(\\d{1,2})\\D(\\d{2})\\D(\\d{2})';
const MATCH_STAMP = `^\\s*${MATCH_DATE}(?:(?:T|\\s)${MATCH_TIME})?`;
const STAMP_REGEX = new RegExp(MATCH_STAMP);
const STAMP_PARTS = [undefined, 'year', 'month', 'day', 'hours', 'minutes', 'seconds'];

/**
 * Default configuration options.
 */
const defaults = {
  joint:     ' ',
  dateJoint: '-',
  timeJoint: ':',
}

/**
 * The Timestamp class implements an object for parsing and manipulating
 * ISO8601 timestamps.  It is a very simple implementation that is intended
 * to be lightweight alternative to more feature-rich packages like
 * moment, luxon, dayjs, etc.  The primary goal is to be able to convert
 * between database timestamps and human-readable strings, and to allow
 * simple date adjustments, e.g. + 1 year, + 3 months, etc.  It is implemented
 * as a thin wrapper around the native JS Date object.
 */
export class Timestamp {
  /**
   * Constructor for Timestamp object.
   * @param {String|Integer|Date|Object} [ts] - timestamp
   * @param {Object} [options] - configuration options
   * @param {String} [options.joint=' '] - joining character between date and time parts
   * @param {String} [options.dateJoint='-'] - joining character for date segments
   * @param {String} [options.timeJoint=':'] - joining character for time segments
   */
  constructor(ts, options) {
    const props = { ...defaults, ...options };
    addDebug(this, props.debug, props.debugPrefix, props.debugColor);

    this.props = props;

    if (noValue(ts)) {
      // use current time if no argument provided
      this.parts = unpackNow()
    }
    else if (isTimestamp(ts)) {
      // split timestamp string
      this.parts = splitTimestamp(ts)
    }
    else if (isString(ts)) {
      // parse another date string
      this.parts = parseDate(ts)
    }
    else if (isDate(ts)) {
      // unpack a Date object
      this.parts = unpackDate(ts)
    }
    else if (isInteger(ts)) {
      // milliseconds since the epoch
      this.parts = parseDate(ts)
    }
    else if (isObject(ts)) {
      if (hasValue(ts.unix)) {
        // seconds since unix epoch time, multiply by 1000 to get JS milliseconds
        this.parts = parseDate(ts.unix * 1000);
      }
      else if (hasValue(ts.ms)) {
        // milliseconds since unix epoch time
        this.parts = parseDate(ts.ms);
      }
      else {
        // object containing year, month, day, etc.
        this.parts = ts
      }
    }
    else {
      fail("Invalid timestamp: ", ts)
    }
  }
  /**
   * Method to return a formatted date string in the form `YYYY-MM-DD`.
   * @param {String} [joint='-'] - optional joining character
   * @return {String} - formatted date string
   */
  date(joint=this.props.dateJoint) {
    return joinDate(this.parts, joint)
  }
  /**
   * Method to return a formatted time string in the form `HH:MM:SS`.
   * @param {String} [joint=':''] - optional joining character
   * @return {String} - formatted time string
   */
  time(joint=this.props.timeJoint) {
    return joinTime(this.parts, joint)
  }
  /**
   * Method to return a formatted timestamp string in the form `YYYY-MM-DD HH:MM:SS`.
   * @param {Object} [options] - configuration options
   * @param {String} [options.joint=' '] - joining character between date and time parts
   * @param {String} [options.dateJoint='-'] - joining character for date segments
   * @param {String} [options.timeJoint=':'] - joining character for time segments
   * @return {String} - formatted date/time stamp
   */
  stamp(options={}) {
    return joinTimestamp(this.parts, { ...this.props, ...options })
  }
}

/**
 * Function to determine is a string is a valid timestamp.
 * @param {String} ts - timestamp string
 * @return {Boolean} - value indicating if the string is a timestamp
 */
export const isTimestamp = ts =>
  isString(ts) && ts.match(STAMP_REGEX);

/**
 * Function to split a timestamp into its constituent parts
 * @param {String} ts - timestamp string
 * @return {Object} - object containing `year`, `month`, `day`, `hours`, `minutes` and `seconds`.
 */
export const splitTimestamp = ts => {
  const match = ts.match(STAMP_REGEX) || fail("Invalid timestamp: ", ts);
  let result = { };
  STAMP_PARTS.forEach(
    (part, n) => {
      if (part && match[n]) {
        result[part] = parseInt(match[n]);
      }
    }
  );
  // console.log('%s => ', ts, result);
  return result;
}

/**
 * Function to determine is a valid is a `Date` object
 * @param {Date} date - date object or other value
 * @return {Boolean} - value indicating if the `date` is a `Date` object
 */
export const isDate = date =>
  date instanceof Date;

/**
 * Function to return an object containing the constituent timestamp parts for the current time.
 * @return {Object} - object containing `year`, `month`, `day`, `hours`, `minutes` and `seconds`.
 */
export const unpackNow = () =>
  unpackDate(new Date());

/**
 * Function to return an object containing the constituent timestamp parts for a date/time.
 * @param {Date} date - date object or string that can be parsed by `Date.parse()`
 * @return {Object} - object containing `year`, `month`, `day`, `hours`, `minutes` and `seconds`.
 */
export const parseDate = (date) =>
  unpackDate(new Date(date));

/**
 * Function to return an object containing the constituent timestamp parts for a `Date` object
 * @param {Date} date - date object
 * @return {Object} - object containing `year`, `month`, `day`, `hours`, `minutes` and `seconds`.
 */
export const unpackDate = date => ({
  year:    date.getFullYear(),
  month:   date.getMonth() + 1,
  day:     date.getDate(),
  hours:   date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds(),
})

/**
 * Function to join the constituent parts of a time stamp into a string
 * @param {Object} ts - object containing `year`, `month`, `day`, and optionally, `hours`, `minutes` and `seconds`.
 * @param {String} ts.year - the year as an integer
 * @param {String} ts.month - the month as an integer from 1 to 12
 * @param {String} ts.day - the month as an integer
 * @param {String} ts.[hours] - the hours as an integer from 0 to 23
 * @param {String} ts.[minutes] - the minutes as an integer from 0 to 59
 * @param {String} ts.[seconds] - the seconds as an integer from 0 to 59
 * @param {String} [config] - optional configuration options
 * @param {String} [config.joint=' '] - joining character between date and time parts
 * @param {String} [config.dateJoint='-'] - joining character for date segments
 * @param {String} [config.timeJoint=':'] - joining character for time segments
 * @return {String} - timestamp string of the form `YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS`
 */
export const joinTimestamp = (ts, config={}) => {
  const date = joinDate(ts, config.dateJoint);

  if (hasValue(ts.hours)) {
    const time = joinTime(ts, config.timeJoint);
    return [date, time].join(hasValue(config.joint) ? config.joint : defaults.joint);
  }
  else {
    return date;
  }
}

/**
 * Function to join the constituent parts of a date
 * @param {Object} ts - object containing `year`, `month`, `day`
 * @param {String} ts.year - the year as an integer
 * @param {String} ts.month - the month as an integer from 1 to 12
 * @param {String} ts.day - the month as an integer
 * @param {String} [joint='-'] - optional joining character for date segments
 * @return {String} - date string of the form `YYYY-MM-DD`
 */
export const joinDate = (ts, joint=defaults.dateJoint) =>
  [
    String(ts.year).padStart(4, '0'),
    String(ts.month).padStart(2, '0'),
    String(ts.day).padStart(2, '0'),
  ].join(joint)

/**
 * Function to join the constituent parts of a time into a string
 * @param {Object} ts - object containing `hours`, `minutes` and `seconds`.
 * @param {String} ts.hours - the hours as an integer from 0 to 23
 * @param {String} ts.minutes - the minutes as an integer from 0 to 59
 * @param {String} ts.seconds - the seconds as an integer from 0 to 59
 * @param {String} [joint=':'] - optional joining character for time segments
 * @return {String} - time string of the form `HH:MM:SS`
 */
export const joinTime = (ts, joint=defaults.timeJoint) =>
  [
    String(ts.hours).padStart(2, '0'),
    String(ts.minutes).padStart(2, '0'),
    String(ts.seconds).padStart(2, '0'),
  ].join(joint)

/**
 * Function to create a new `Timestamp` object
 * @param {String|Integer|Date|Object} [ts] - timestamp
 * @param {Object} [options] - configuration options
 * @param {String} [options.joint=' '] - joining character between date and time parts
 * @param {String} [options.dateJoint='-'] - joining character for date segments
 * @param {String} [options.timeJoint=':'] - joining character for time segments
 * @return {Object} - a `Timestamp` object
 */
export const timestamp = (ts, options) => new Timestamp(ts, options)