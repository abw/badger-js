import test from 'ava';
import { cmdLineArg, cmdLineFlags } from '../../src/Badger.js';

test(
  'remove flags from args',
  t => {
    let input = ['-a', 'foo', '--bravo', 'bar', '-c'];
    let { flags, args } = cmdLineFlags(input);
    t.deepEqual(args, ['foo', 'bar']);
    t.deepEqual(flags, { a: true, bravo: true, c: true });
  }
)

test(
  'remove flags from middle args',
  t => {
    let input = ['foo', '-a', 'bar', '--bravo', '-c'];
    let { flags, args } = cmdLineFlags(input);
    t.deepEqual(args, ['foo', 'bar']);
    t.deepEqual(flags, { a: true, bravo: true, c: true });
  }
)

test(
  'flags with short mapping',
  t => {
    let input = ['foo', '-a', 'bar', '--bravo', '-c'];
    let { flags, args } = cmdLineFlags(
      {
        short: {
          a: 'alpha',
          b: 'bonkers',
          c: 'charlie'
        }
      },
      input
    );
    t.deepEqual(args, ['foo', 'bar']);
    t.deepEqual(flags, { alpha: true, bravo: true, charlie: true });
  }
)

test(
  'flags with short mapping dup',
  t => {
    let input = ['foo', '-a', 'bar', '--bravo', '-b', '-c'];
    let { flags, args } = cmdLineFlags(
      {
        short: {
          a: 'alpha',
          b: 'bravo',
          c: 'charlie'
        }
      },
      input
    );
    t.deepEqual(args, ['foo', 'bar']);
    t.deepEqual(flags, { alpha: true, bravo: true, charlie: true });
  }
)

test(
  'flags with on actions',
  t => {
    let seenA = false;
    let seenB = false;
    let seenC = false;
    let input  = ['foo', '-a', 'bar', '--bravo', '-c'];
    let { flags, args } = cmdLineFlags(
      {
        short: {
          a: 'alpha',
          b: 'bravo',
          c: 'charlie'
        },
        on: {
          alpha:   () => { seenA = true },
          bravo:   () => { seenB = true },
          charlie: () => { seenC = true },
        }
      },
      input
    );
    t.deepEqual(args, ['foo', 'bar']);
    t.deepEqual(flags, { alpha: true, bravo: true, charlie: true });
    t.true(seenA)
    t.true(seenB)
    t.true(seenC)
  }
)

test(
  'flags with options',
  t => {
    let input  = ['foo', '-a', 'bar', '--bravo'];
    let { flags, args } = cmdLineFlags(
      {
        short: {
          a: 'alpha',
        },
        options: 'alpha bravo',
      },
      input
    );
    t.deepEqual(args, ['foo', 'bar']);
    t.deepEqual(flags, { alpha: true, bravo: true });
  }
)

test(
  'flags with options and keep others',
  t => {
    let input  = ['foo', '-a', 'bar', '--bravo', '--charlie'];
    let { flags, args } = cmdLineFlags(
      {
        short: {
          a: 'alpha',
        },
        options: 'alpha bravo',
        others:  'keep'
      },
      input
    );
    t.deepEqual(args, ['foo', 'bar', '--charlie']);
    t.deepEqual(flags, { alpha: true, bravo: true });
  }
)

test(
  'flags with options and collect others',
  t => {
    let input  = ['foo', '-a', 'bar', '--bravo', '--charlie'];
    let { flags, args } = cmdLineFlags(
      {
        short: {
          a: 'alpha',
        },
        options: 'alpha bravo',
        others:  'collect'
      },
      input
    );
    t.deepEqual(args, ['foo', 'bar']);
    t.deepEqual(flags, { alpha: true, bravo: true, charlie: true });
  }
)

test(
  'flags with options and remove others',
  t => {
    let input  = ['foo', '-a', 'bar', '--bravo', '--charlie'];
    let { flags, args } = cmdLineFlags(
      {
        short: {
          a: 'alpha',
        },
        options: 'alpha bravo',
        others:  'remove'
      },
      input
    );
    t.deepEqual(args, ['foo', 'bar']);
    t.deepEqual(flags, { alpha: true, bravo: true });
  }
)

test(
  'flags with options and default error condition',
  t => t.throws(
    () => {
      let input = ['foo', '-a', 'bar', '--bravo', '--charlie'];
      cmdLineFlags(
        {
          short: {
            a: 'alpha',
          },
          options: 'alpha bravo',
        },
        input
      );
    },
    { message: "Invalid command line flag: --charlie" }
  )
)

test(
  'flags with options and invalid others',
  t => t.throws(
    () => {
      let input = ['foo', '-a', 'bar', '--bravo', '--charlie'];
      cmdLineFlags(
        {
          short: {
            a: 'alpha',
          },
          options: 'alpha bravo',
          others: 'flibble'
        },
        input
      );
    },
    { message: 'Invalid "others" option: flibble' }
  )
)

test(
  'cmdLine()',
  async t => {
    let args = ['foo', 'bar'];
    let foo = await cmdLineArg(null, args);
    t.is( foo, 'foo' )
    t.deepEqual( args, ['bar'] )
  }
)
