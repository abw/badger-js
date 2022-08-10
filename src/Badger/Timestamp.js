import { addDebug } from "./Utils/Debug.js";
import { fail, hasValue, isInteger, isObject, isString, noValue } from "@abw/badger-utils";

const MATCH_DATE  = '(\\d{4})\\D(\\d{1,2})\\D(\\d{1,2})';
const MATCH_TIME  = '(\\d{1,2})\\D(\\d{2})\\D(\\d{2})';
const MATCH_STAMP = `^\\s*${MATCH_DATE}(?:(?:T|\\s)${MATCH_TIME})?`;
const STAMP_REGEX = new RegExp(MATCH_STAMP);
const STAMP_PARTS = [undefined, 'year', 'month', 'day', 'hours', 'minutes', 'seconds'];
const DURATIONS   = ['year', 'month', 'day', 'hour', 'minute', 'second'];
const PLURALS     = { hour: 'hours', minute: 'minutes', second: 'seconds' };

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
    else if (ts instanceof Timestamp) {
      // copy constructor
      this.parts = { ...ts.parts };
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
   * Method to return a new object as a copy of the current object
   * @return {Object} - new `Timestamp` object
   */
  copy() {
    return new Timestamp(this.parts);
  }
  /**
   * Method to get or set the year.
   * @param {Integer} [year] - optional new value for year
   * @return {Integer} - the year
   */
  year(year) {
    if (hasValue(year)) {
      this.parts.year = year;
    }
    return this.parts.year;
  }
  /**
   * Method to get or set the month.
   * @param {Integer} [month] - optional new value for month
   * @return {Integer} - the month
   */
  month(month) {
    if (hasValue(month)) {
      this.parts.month = month;
    }
    return this.parts.month;
  }
  /**
   * Method to get or set the day.
   * @param {Integer} [day] - optional new value for day
   * @return {Integer} - the day
   */
  day(day) {
    if (hasValue(day)) {
      this.parts.day = day;
    }
    return this.parts.day;
  }
  /**
   * Method to get or set the hours.
   * @param {Integer} [hours] - optional new value for hours
   * @return {Integer} - the hours
   */
  hours(hours) {
    if (hasValue(hours)) {
      this.parts.hours = hours;
    }
    return this.parts.hours;
  }
  /**
   * Method to get or set the minutes.
   * @param {Integer} [minutes] - optional new value for minutes
   * @return {Integer} - the minutes
   */
  minutes(minutes) {
    if (hasValue(minutes)) {
      this.parts.minutes = minutes;
    }
    return this.parts.minutes;
  }
  /**
   * Method to get or set the seconds.
   * @param {Integer} [seconds] - optional new value for seconds
   * @return {Integer} - the seconds
   */
  seconds(seconds) {
    if (hasValue(seconds)) {
      this.parts.seconds = seconds;
    }
    return this.parts.seconds;
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
  /**
   * Method to return a `Date` object
   * @return {Date} - new date object
   */
  dateObject() {
    return new Date(this.stamp({ joint: 'T', dateJoint: '-', timeJoint: ':' }));
  }
  /**
   * Method to return the number of millseconds since the Unix epoch
   * @return {Integer} - the number of milliseconds
   */
  milliseconds() {
    return this.dateObject().getTime();
  }
  /**
   * Method to return the number of seconds since the Unix epoch
   * @return {Integer} - the number of seconds
   */
  epochSeconds() {
    return Math.floor(this.milliseconds() / 1000);
  }
  /**
   * Method to adjust the timestamp.  The duration can be specified as a string containing
   * one or more items to adjust in either singular or plural form, e.g. `"1 year, 1 month"`,
   * `"2 years 2 months"`, etc. Or it can be specified as an object: `{ year: 1, month: 1 }`,
   * `{ years: 2, months: 2 }`, etc.
   * @param {String|Object} duration - a string or object of adjustments
   * @example
   * ts.adjust("1 year 2 months 3 hours")
   * @example
   * ts.adjust({ year: 1, months: 2, hours: 3 })
   */
  adjust(duration) {
    let p = this.parts;
    const d = isString(duration)
      ? parseDuration(duration)         // parse string to object
      : singularDurations(duration);    // convert plurals (e.g. "hours") to singular form (e.g. "hour")
    DURATIONS.forEach(
      unit => {
        const value = d[unit];
        if (hasValue(value)) {
          // By convention we store date elements in singular (year, month, day) and time
          // elements in plural (hours, minutes, seconds), but we convert all durations to
          // singluar in parseDuration() and singularDuration() (because it's easier to drop
          // an 's' from the end of plural than optionally add one.  Here we use the PLURALS
          // lookup table to map singular hour, minute and second back to their plurals.
          p[PLURALS[unit]||unit] += value;
        }
      }
    );

    // time underflow
    while (p.seconds < 0) {
      p.seconds += 60;
      p.minutes--;
    }
    while (p.minutes < 0) {
      p.minutes += 60;
      p.hours--;
    }
    while (p.hours < 0) {
      p.hours += 24;
      p.day--;
    }

    // time overflow
    if (p.seconds > 59) {
      p.minutes += Math.floor(p.seconds / 60);
      p.seconds %= 60;
    }
    if (p.minutes > 59) {
      p.hours += Math.floor(p.minutes / 60);
      p.minutes %= 60;
    }
    if (p.hours > 23) {
      p.day += Math.floor(p.hours / 24);
      p.hours %= 24;
    }

    // date underflow
    while (p.day <= 0) {
      p.month--;
      if (p.month <= 0) {
        p.month += 12;
        p.year--;
      }
      p.day += daysInMonth(p.month, p.year);
    }
    while (p.month <= 0) {
      p.month += 12;
      p.year--;
    }

    // month overflow
    while (p.month > 12) {
      p.month -= 12;
      p.year++;
    }

    // day overflow
    let dim;
    while (p.day > (dim = daysInMonth(p.month, p.year))) {
      p.day -= dim;
      if (p.month == 12) {
        p.month = 1;
        p.year++;
      }
      else {
        p.month++;
      }
    }

    return this;
  }
  /**
   * Method to compare the timestamp to another.  The arguments can be any that are accepted
   * by the constructor.
   * one or more items to adjust in either singular or plural form, e.g. `"1 year, 1 month"`,
   * `"2 years 2 months"`, etc. Or it can be specified as an object: `{ year: 1, month: 1 }`,
   * `{ years: 2, months: 2 }`, etc.
   * @param {Array} args - any argument(s) accepted by the constructor
   * @return {Integer} - -1 if the timestamp is before the comparator, 0 if it's equal, +1 if it's after.
   */
  compare(...args) {
    const that  = new Timestamp(...args);
    const thisp = this.parts;
    const thatp = that.parts;
    this.debug("this: ", thisp)
    this.debug("that: ", thisp)

    for (let p of STAMP_PARTS) {
      if (p) {
        if (thisp[p] < thatp[p]) {
          this.debug("[%s] this[%s] < that[%s]", p, thisp[p], thatp[p])
          return -1;
        }
        else if (thisp[p] > thatp[p]) {
          this.debug("[%s] this[%s] > that[%s]", p, thisp[p], thatp[p])
          return 1;
        }
        else {
          this.debug("[%s] this[%s] = that[%s]", p, thisp[p], thatp[p])
        }
      }
    }
    return 0;
  }
  /**
   * Method to compare one timestamp to another for equality
   * @param {Array} args - any argument(s) accepted by the constructor
   * @return {Boolean} - true if the timestamp is equal to the operand
   */
  equal(...args) {
    return this.compare(...args) == 0;
  }
  /**
   * Method to test for the timestamp coming before another timestamp
   * @param {Array} args - any argument(s) accepted by the constructor
   * @return {Boolean} - true if the timestamp is before the operand
   */
  before(...args) {
    return this.compare(...args) == -1;
  }
  /**
   * Method to test for the timestamp coming after another timestamp
   * @param {Array} args - any argument(s) accepted by the constructor
   * @return {Boolean} - true if the timestamp is after the operand
   */
  after(...args) {
    return this.compare(...args) == 1;
  }
  /**
   * Method to test for the timestamp being equal to or coming after another timestamp
   * @param {Array} args - any argument(s) accepted by the constructor
   * @return {Boolean} - true if the timestamp is equal to or coming after the operand
   */
  notBefore(...args) {
    return this.compare(...args) >= 0;
  }
  /**
   * Method to test for the timestamp being equal to or coming before another timestamp
   * @param {Array} args - any argument(s) accepted by the constructor
   * @return {Boolean} - true if the timestamp is equal to or coming before the operand
   */
  notAfter(...args) {
    return this.compare(...args) <= 0;
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
 * Function to parse a duration string, e.g. `1 hour 3 minutes`.
 * Quantities must be integers. Units can be singular (e.g. `hour`) or plural (e.g. `hours`).
 * Other characters may appear between sections, e.g. `1 hour, 2 minutes and 3 seconds`.
 * @param {Date} duration - duration string
 * @return {Object} - object containing any of `year`, `month`, `day`, `hour`, `minute` and `second`.
 */
export const parseDuration = duration => {
  const match = duration.matchAll(/(-?\d+)\s*(\w+)/g);
  let result = { };

  for (let m of match) {
    const n = parseInt(m[1]);           // convert quantity to integer
    const d = m[2].replace(/s$/, '');   // convert plural to singular
    result[d] = n;
  }
  return result;
}

/**
 * Function to convert an object containing any plural duration units (e.g. `hours`) to the singular counterpart (e.g. `hour`).
 * @param {Object} duration - object containing duration elements, either plural or singluar.
 * @return {Object} - object containing any of `year`, `month`, `day`, `hour`, `minute` and `second`.
 */
export const singularDurations = duration => {
  let result = { };
  Object.entries(duration).forEach(
    ([key, value]) => {
      result[key.replace(/s$/, '')] = value;
    }
  )
  return result;
}

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


const daysInMonth = (m, y) => {
  if (m === 4 || m === 6 || m === 9 || m === 11) {
    return 30;
  }
  else if (m == 2) {
    return leapYear(y) ? 29 : 28;
  }
  else {
    return 31;
  }
}

const leapYear = y => {
  if (y % 4) {
    return 0;
  }
  else if (y % 400 === 0) {
    return 1;
  }
  else if (y % 100 == 0) {
    return 0;
  }
  else {
    return 1;
  }
}


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