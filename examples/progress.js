#!/usr/bin/env node
import { progress } from '../src/Badger/Utils/Progress.js';
import { range, sleep } from '@abw/badger-utils';

runExamples()

async function runExamples() {
  await basicExample();
  await numberedExample();
  await customColours();
  await customPicture();
  await customPictureAndColours();
  await elapsed();
}

//--------------------------------------------------------------------------
// progress() without any arguments defaults to a size of 100.
//--------------------------------------------------------------------------
async function basicExample() {
  console.log('Basic Example');
  const p = progress();
  // await showProgress(p);
  await showProgress(p, { to: 10, step: 10 });
}

//--------------------------------------------------------------------------
// progress(size) sets the number of items that you're processing.
// Each time you process an items (or block of items), you call the
// printProgress(n) method (see the showProgress() function below that
// we're using to simulate delayed progress), passing the number of items
// that you've processed in that block (defaults to 1 for the common case
// when you process one item at a time)
//--------------------------------------------------------------------------
async function numberedExample() {
  console.log('Specify Number of Elements');
  const p = progress(200);
  await showProgress(p, { to: 200, delay: 5 });
}

//--------------------------------------------------------------------------
// progress({ ... }) for more complex configuration, including custom
// colours for border, background and foreground.
//--------------------------------------------------------------------------
async function customColours() {
  console.log('Custom Colours');
  const p = progress({
    size: 42,
    colours: {
      border:     'blue',
      background: 'dark blue',
      foreground: 'blue',
      fill:       'bright blue',
    }
  });
  await showProgress(p, { to: 42, delay: 100 });
}

//--------------------------------------------------------------------------
// Define a custom picture
//--------------------------------------------------------------------------
async function customPicture() {
  console.log('Custom Picture');
  const picture = `
┌───────────────────────┐
│ ●∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙● │
│ ∙∙●∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙●∙∙ │
│ ∙∙∙∙●∙∙∙∙∙∙∙∙∙∙∙●∙∙∙∙ │
│ ∙∙∙∙∙∙●∙∙∙∙∙∙∙●∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙●∙∙∙●∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙∙∙●∙∙∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙∙∙●∙∙∙●∙∙∙∙∙∙∙∙ │
│ ∙∙∙∙∙∙●∙∙∙∙∙∙∙●∙∙∙∙∙∙ │
│ ∙∙∙∙●∙∙∙∙∙∙∙∙∙∙∙●∙∙∙∙ │
│ ∙∙●∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙●∙∙ │
│ ●∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙● │
└───────────────────────┘
`
  const p = progress({ picture });
  await showProgress(p);
}

//--------------------------------------------------------------------------
// Add charTypes with the picture to give "classes" to characters
//--------------------------------------------------------------------------
async function customPictureAndColours() {
  console.log('Custom Picture and Colours');
  const picture = {
    // charTypes gives a type to the characters so they can be coloured
    charTypes: {
      border:     '┌┐─│└┘',
      background: '∙',
      sides:      '⁃',
      // everything else defaults to 'foreground'
    },
    source: `
┌───────────────────────┐
│ ●∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙● │
│ ⁃⁃●∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙●⁃⁃ │
│ ⁃⁃⁃⁃●∙∙∙∙∙∙∙∙∙∙∙●⁃⁃⁃⁃ │
│ ⁃⁃⁃⁃⁃⁃●∙∙∙∙∙∙∙●⁃⁃⁃⁃⁃⁃ │
│ ⁃⁃⁃⁃⁃⁃⁃⁃●∙∙∙●⁃⁃⁃⁃⁃⁃⁃⁃ │
│ ⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃●⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃ │
│ ⁃⁃⁃⁃⁃⁃⁃⁃●∙∙∙●⁃⁃⁃⁃⁃⁃⁃⁃ │
│ ⁃⁃⁃⁃⁃⁃●∙∙∙∙∙∙∙●⁃⁃⁃⁃⁃⁃ │
│ ⁃⁃⁃⁃●∙∙∙∙∙∙∙∙∙∙∙●⁃⁃⁃⁃ │
│ ⁃⁃●∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙●⁃⁃ │
│ ●∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙● │
└───────────────────────┘
`
  };
  const p = progress({
    picture,
    colours: {
      border:     'bright blue',
      background: 'dark grey',
      sides:      'cyan',
      foreground: 'bright cyan'
    }
  });
  await showProgress(p);
}

//--------------------------------------------------------------------------
// Set the elapsed flag to display elapsed time.
//--------------------------------------------------------------------------
async function elapsed() {
  console.log('Show Time Elapsed');
  const p = progress({
    size: 420,
    elapsed: true
  });
  await showProgress(p, { to: 420, delay: 15 });
}

//--------------------------------------------------------------------------
// Generic function to simulate progress being made.
//--------------------------------------------------------------------------
async function showProgress(p, config={}) {
  const { from, to, step, delay } = {
    from:   0,
    to:     100,
    step:   1,
    delay:  20,
    ...config
  }
  // eslint-disable-next-line no-unused-vars
  for (let r of range(from, to-1)) {
    await sleep(delay);
    p.printProgress(step);
  }
  p.printRemains();
}
