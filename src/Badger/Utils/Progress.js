import { now } from '@abw/badger-timestamp';
import { isInteger, isString } from '@abw/badger-utils';
import { addDebug } from './Debug.js';
import { color } from './Color.js';
import process from 'node:process';

export const charTypes = {
  border: '┌─┐│└─┘|-',
  background: '+∙',
  fill: '*',
};

export const colours = {
  border:     'green',
  background: 'dark grey',
  foreground: 'blue',
  fill:       'bright yellow'
};

export const picture = {
  charTypes,
  source: `
┌────────────────────────────────────────────────────────────────┐
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙ ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● ∙∙ │
│ ∙∙ ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● ∙∙ │
│ ∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙ │
│ ∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙ │
│ ∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙ │
│ ∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙ │
│ ∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙ │
│ ∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙ ●● *◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦* ●● ∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙ ●● **◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦** ●● ∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙ ●● *****◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦***** ●● ∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● *******◦◦◦◦◦◦◦◦◦◦******* ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ****************** ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ************ ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ****** ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● **** ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● **** ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● **** ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ◦****◦ ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ◦◦◦◦****◦◦◦◦ ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦****◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦******◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦********◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦◦************◦◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦◦******************◦◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙ ●● ◦◦◦◦◦◦◦◦◦************************◦◦◦◦◦◦◦◦◦ ●● ∙∙∙∙∙∙ │
│ ∙∙∙∙∙ ●● ◦◦◦◦◦◦◦******************************◦◦◦◦◦◦◦ ●● ∙∙∙∙∙ │
│ ∙∙∙∙ ●● ◦◦◦◦◦************************************◦◦◦◦◦ ●● ∙∙∙∙ │
│ ∙∙∙ ●● ◦◦◦◦****************************************◦◦◦◦ ●● ∙∙∙ │
│ ∙∙ ●● ◦◦◦********************************************◦◦◦ ●● ∙∙ │
│ ∙∙ ●● ◦◦**********************************************◦◦ ●● ∙∙ │
│ ∙∙ ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● ∙∙ │
│ ∙∙ ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●● ∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ │
└────────────────────────────────────────────────────────────────┘
`
};

const defaults = {
  size:    100,
  elapsed: false,
  picture,
  colours
}

export function preparePicture(config) {
  const { source, charTypes={ background: '' } } = config
  const picture  = source.trim() + "\n";
  const length   = picture.length;
  const charType = Object
    .entries(charTypes)
    .reduce(
      (types, [type, chars]) => {
        chars.split('').forEach(
          char => types[char] = type
        );
        return types
      },
      { }
    )
  const lineLength = source
    .split("\n")
    .reduce(
      (longest, line) => Math.max(longest, line.length),
      0
    )
  return { picture, length, lineLength, charType };
}

export function prepareColours(colours) {
  return Object.entries(colours).reduce(
    (formatters, [type, colour]) => {
      formatters[type] = color(colour);
      return formatters;
    },
    { }
  )
}

export function formatPicture(config) {
  const { picture, charType={}, colours={} } = config;
  return picture
    .split('')
    .map(
      char => {
        const type = charType[char] || 'foreground'
        const col  = colours[type];
        return col ? col(char) : char;
      }
    )
    .join('')
}

export function formatElapsed(elapsed) {
  const s = elapsed % 60;
  const m = Math.floor(elapsed / 60);
  const h = Math.floor(elapsed / 3600);
  return [h, m, s].map( x => x.toString().padStart(2, '0') ).join(':');
}

export class Progress {
  constructor(params={}) {
    const config = {
      ...defaults,
      ...(
        // you wouldn't believe the number of times I've tried to create a
        // progress object passing only the size as an argument instead of
        // { size: N } so this de-numpties my numptiness
        isInteger(params)
          ? { size: params }
          : params
      )
    };
    const { size, colours, colors, debug, elapsed } = config;
    const { picture, length, lineLength, charType } =
      preparePicture(
        isString(config.picture)
          ? { source: config.picture, charTypes }
          : config.picture
      );
    this.size        = size;
    this.picture     = picture;
    this.pixels      = this.picture.split('');
    this.length      = length;
    this.lineLength  = lineLength;
    this.charType    = charType;
    this.colours     = prepareColours(colors || colours);
    this.count       = 0;
    this.lastCount   = 0;
    this.lastPixel   = 0;
    this.startTime   = now().epochSeconds();
    this.elapsed     = 0;
    this.elapsedCol  = color('dark grey');
    this.showElapsed = elapsed;
    this.debugging   = debug;
    addDebug(this, debug, 'Progress > ', 'blue');
  }

  progress(n=1) {
    this.count += n;

    const time     = now().epochSeconds();
    const elapsed  = time - this.startTime;
    this.elapsed   = elapsed;
    // const duration = elapsed - this.elapsed;

    const end = Math.floor(this.length * this.count / this.size);
    if (end > this.lastPixel) {
      const start = this.lastPixel;
      this.lastPixel = end;
      this.debug(`count: ${this.count}/${this.size}  pixels from ${start} to ${end}`);
      return this.pictureSegment(start, end);
    }
    else {
      return '';
    }
  }

  remains() {
    this.count  = this.size;
    const start = this.lastPixel;
    const end   = this.length;
    if (end > start) {
      this.lastPixel = this.length;
      return this.pictureSegment(start, end);
    }
    else {
      return '';
    }
  }
  pictureSegment(start, end) {
    if (this.debugging) {
      return '';
    }

    let slice = formatPicture({
      picture:  this.picture.substring(start, end),
      charType: this.charType,
      colours:  this.colours,
    });

    // this.picture.substring(start, end);
    if (this.showElapsed && slice.match("\n")) {
      const lines = slice.split("\n");
      const last = lines.pop();
      slice = lines
        .map( line => line + ` ` + this.elapsedCol(formatElapsed(this.elapsed)) )
        .join("\n")
        .concat("\n", last)
    }
    return slice;
  }

  printProgress(n=1) {
    process.stdout.write(this.progress(n));
  }

  printRemains() {
    process.stdout.write(this.remains());
  }
}

export const progress = config => new Progress(config);

export default progress
