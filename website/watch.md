---
outline: deep
---
# Watch

The more things change, the more they stay the same.  Or, as they say in
France, "Omelette Du Fromage".

## watch()

The `watch()` function implements a command line program for running another
program while watching one or more files or directories.  If any of the
watched files change then it restarts the program.

It's implemented as a wrapper around
[chokidar](https://www.npmjs.com/package/chokidar) with some additional
command line processing.

You can create a simple script like this and run it with the `-h` command
line option for help.

```js
import { watch } from '@abw/badger'

watch()
```

But you don't need to do that because we've done it for you.  There's a
`badger-watch` script provide as part of this distribution.

You can run `badger-watch` as a script from your `package.json` file.
For example, something like this:

```json
"scripts": {
  "watch": "badger-watch -v -r -w lib -w config my-program.js arg1 arg2"
}
```

In this example, running the command `npm watch` will run
`my-program.js arg1 arg2` and if any of the files in the `lib` or `config`
directories change the program will be restarted.

The `-v` or `--verbose` option enables verbose mode.  The `-r` or `--restart`
option will restart the program whenever it exits.  The `-w <path>` or
`--watch <path>` option watches a path (e.g. a file or directory) for changes.
The `-h` or `--help` option displays the help.

You can pass additional arguments to your program (e.g. `arg1` and `arg2` as
shown above).  These can include arguments with dashes (e.g. `-foo`, `--bar`,
etc).  If any of the arguments you want to pass to your program are those
accepted by the watch command (e.g. `-v`, `--verbose`, etc.) then you should
use the `--` option just before your program so that they don't conflict.

For example, if your program accepts a `-v` option then you should invoke it
like this:

```bash
badger-watch -v -r -w lib -w config -- my-program.js -v arg1 arg2"
```
