---
outline: deep
---
# User Input

There are a number of function to help with processing command line arguments
and getting input from users. Some of them are quick and easy functions of
convenience to make simple things simple.  At the other end of the scale the
[`options()`](#options) function provides an integrated way to process command
line arguments (using [commander](https://www.npmjs.com/package/commander))
and prompt the user for any missing configuration options
(using [prompts](https://www.npmjs.com/package/prompts)).

## User Input

### `prompt()`

The `prompt()` function is a quick-and-easy way to ask a user to enter some
input.  It is implemented as a wrapper around the
[prompt](https://www.npmjs.com/package/prompts) module.

The first argument is the question to ask the user.

```js
import { prompt } from '@abw/badger'

const name = await prompt("What is your name?");
console.log('Hello ', name);
```

An optional second argument can be the default answer:

```js
const name = await prompt("What is your name?", 'Mr Badger');
```

This is a convenient short-hand for passing an object with a `default`
property.

```js
const name = await prompt("What is your name?", { default: 'Mr Badger' });
```

### `confirm()`

The `confirm()` function allows you to prompt the user to confirm an action
by pressing `y` for `yes` or `n` for `no`.

```js
import { confirm } from '@abw/badger'

const yes = await confirm("Are you sure?");
console.log('You said "%s"', yes ? 'YES' : 'NO');
```

The default answer is `N`, returning a `false` value, but you can pass
`true` as the second argument to make `Y` the default.

```js
const yes = await confirm("Are you sure?", true);
console.log('You said "%s"', yes ? 'YES' : 'NO');
```

### `select()`

The `select()` function is another wrapper of convenience for getting the
user to select an option from a list.

Here the second argument should be an array of options, with each as an object
containing a `title` and `value`, or you can pass an object where each keys
is a `value` mapped to a `title`.

```js
import { select } from '@abw/badger'

const animal = await select(
  'What is your favourite animal?',
  {
    aardvark: 'An amazing aardvark',
    badger:   'A brilliant badger',
    cat:      'A cool cat',
    dog:      'A dapper dog'
  },
  1
);
console.log('You chose:', animal);  // aardvark, badger, cat or dog
```

These are the three functions that I find myself using a lot.  For anything
more complicated you should probably cut out the middle-man and go straight
to [prompts](https://www.npmjs.com/package/prompts).

## Command Line Arguments

### cmdLineArg()

If you've got a script that expects a command line argument then the
`cmdLineArg()` function is your friend. It will return the first argument
from the command line after your script name.

```js
import { cmdLineArg } from '@abw/badger'

const arg = await cmdLineArg();
```

If the script is run like so:

```bash
$ node your-script.js foo
```

Then the `arg` variable will be set to `foo`.  If you don't specify any
command line arguments after the script name then it will be `undefined`.
If the program can't continue without the argument then you might want to
use the [`quit()`](quitting#quit) function to exit with a helpful
message.

```js
const arg = await cmdLineArg();
  || quit('No argument provided')
```

If you pass a message prompt as an argument then the function will prompt
the user to enter a value if there isn't one provided on the command line.

```js
const name = await cmdLineArg('What is your name?')
  || quit('No name provided')
console.log(`Hello ${name}`)
```

Running the script would look something like this:

```bash
$ node your-script.js
✔ What is your name? … Bobby Badger
Hello Bobby Badger
```

### cmdLineArgs()

If you want to process several command line arguments then you can use the
`cmdLineArgs()` function (note the extra "s" on the end).  Here the first
argument should be an array of prompts for each argument.

```js
const [forename, surname] = await cmdLineArgs(
  ['What is your first name?', 'What is your surname']
) || quit('No name provided')

console.log(`Hello ${forename} ${surname}`);
```

If you don't specify any prompts then it returns all arguments.

Note that both of the above functions take a copy of the command line
arguments to work with (`process.argv.slice(2)`).  They don't modify the
original list of argument so if you call either function multiple times then
you'll end up with the same arguments being returned, starting from
`process.argv[2]` each time.

In this case you should take your own copy of the arguments and pass that as
the second option to the function(s).  You can use the `process.argv.slice(2)`
trick, or call the [`cmdLine()`](#cmdLine) function to do it for you with less typing.

### cmdLine() {#cmdLine}

```js{3-4}
import { cmdLine, cmdLineArg, cmdLineArgs, quit } from '@abw/badger';

// take a copy of the command line arguments to work with
const args = cmdLine();

const [forename, surname] = await cmdLineArgs(
  ['What is your first name?', 'What is your surname'],
  args
) || quit('No name provided')

const age = await cmdLineArg(
  `Hello ${forename} ${surname}, how old are you?`,
  args
) || quit('No age provided')

console.log(`${age} is a fine age`);
```

You can run this script with no arguments, one argument (forename), two
arguments (forename, surname) or three (forename, surname, age).  It will
prompt you to enter any that you omitted.

### cmdLineFlags()

If your script supports command line flags (e.g. `-v` or `--verbose`) then
the `cmdLineFlags()` function can be used to remove them from an argument
list in advance.  This should only be used in simple cases where you want
to detect the presence of a boolean flag.  It doesn't have any built in
support for flags that expect an argument, although you can handle this
yourself with an `on` handler, as shown below.

```js
import { cmdLineFlags } from '@abw/badger';

const { flags, args } = await cmdLineFlags()
console.log('flags:', flags);
console.log('args:', args);
```

Here's an example of the script being run:

```bash
$ node flags-example.js -d --verbose foo -x bar
flags: { d: true, verbose: true, x: true }
args: [ 'foo', 'bar' ]
```

There are a number of configuration options you can pass to the function.
The `short` option allows you to map short options (e.g. `-v`) to longer
equivalents (e.g. `--verbose`).

```js
const { flags, args } = cmdLineFlags(
  {
    short: {
      v: 'verbose',
      d: 'debug',
    }
  },
);
```

In this case, the `-v` or `--verbose` option will result in `verbose` being
set `true` in the returned `flags`.

The `options` option allows you to specify which options are valid.  You
can specify this as an object, where the valid options are the keys and
corresponding values should be `true`:

```js
const { flags, args } = cmdLineFlags(
  {
    options: {
      verbose: true,
      debug:   true,
    }
  },
);
```

Or you can use the short-hand form where you pass an array:

```js
const { flags, args } = cmdLineFlags(
  {
    options: ['verbose', 'debug'],
  },
);
```

Or the even shorter-hand form where you pass a whitespace delimited string:

```js
const { flags, args } = cmdLineFlags(
  {
    options: 'verbose debug',
  },
);
```

If you provide the `options` option then any flags that aren't explicitly
named will cause an error to be throw.

You can specify the `others` option to change this behaviour.  Set it to
`keep` to keep the rogue flag in the argument list, `remove` to remove it
altogether and pretend it never happened, or `collect` to accept it and
return it in the flags.  The default value is `error`.

```js
const { flags, args } = cmdLineFlags(
  {
    options: 'verbose debug',
    others:  'keep',
  },
);
```

Here's an example of the earlier script being run with this configuration:

```bash
$ node flags-example.js --verbose foo -x bar
flags: { verbose: true }
args: [ 'foo','-x', 'bar' ]
```

You can specify `--` as an argument to indicate that the function should stop
processing any further arguments.  In this case any subsequent arguments will
be kept in the `args` list.

```bash
$ node flags-example.js --verbose -- -x foo -y bar -z baz
flags: { verbose: true }
args: [ '-x', 'foo', '-y', 'bar', '-z', 'baz' ]
```

The `on` option can be used to trigger a function when a flag is detected.

```js
const { flags, args } = cmdLineFlags(
  {
    options: 'verbose debug',
    on: {
      help:    () => quit("Help message..."),
      version: () => quit("Version 1.2.3"),
      n:       (name, arg, args, flags) => {
        // Handle something like: -n <number>
        flags.number = args.shift();
        return true
      }
    }
  },
);
```

The `on` handler will be passed four arguments.  The first is the argument
name with the leading hyphens removed.  If it's a `short` option (e.g. `-v`)
which is mapped to a longer name (e.g. `verbose`) then the longer name will
be passed.  The second argument is the flag as it was specified (e.g. `-v`
or `--verbose`).  The third argument is the array of remaining arguments
remaining after the current argument.  The fourth argument is an object
containing the flags collected so far.  You can modify the arguments list
or the flags if you want to.

The function should return `true` if it has handled the argument and no
further processing needs to be done.  If it doesn't return a true value then
processing of the flag continues as normal.

Options that have `on` handlers don't need to be explicitly listed in the
`options` list.

## Command Line Options

### options()

When you have multiple arguments and/or flags then
`options()` function may be a better choice. It handles the logic of
processing flags, arguments and prompting the user to enter any that are
missing.

This simple example shows how options are specified.

```js
const config = await options({
  name: 'options.js',
  version: '0.0.1',
  description: 'Example showing command line options and prompting',
  options: [
    {
      name:     'debug',
      short:    'D',
      about:    'Enable debugging'
    },
    {
      name:     'database',
      short:    'n',
      about:    'Database',
      type:     'text',
      prompt:   'What is the name of the database?',
      required: true,
    },
    {
      name:     'username',
      short:    'u',
      about:    'Username',
      type:     'text',
      prompt:   'What is the database username?',
    },
    {
      name:     'password',
      short:    'p',
      about:    'Password',
      type:     'password',
      prompt:   'What is the database password?',
    },
  ]
});
console.log('config: ', config);
```

Run the script with the `-h` option to view the help.

```sh
Usage: options.js [options]

Example showing command line options and prompting

Options:
  -V, --version              output the version number
  -D, --debug                Enable debugging
  -n, --database <text>      Database
  -u, --username <text>      Username
  -p, --password <password>  Password
  -h, --help                 display help for command
```

The `name`, `version` and `description` are optional items that will be displayed in
the help.

The `options` array defines the valid options.  Each can have a `name` which is
accessible as the "long option", e.g. `--debug`, `--database`, `--username`
and `--password`, and a `short` option, e.g. `-D`, `-d`, `-u` and `-p`.
The `about` item provides information about the option.

After processing the command line arguments, the function will prompt the
user to confirm any values specified as arguments, and enter any missing
values.  The `prompt` item is used to prompt the user.  If this is omitted
then the user will not be prompted to enter a value.  The `type` can be set
to one of the
[types provided by the prompts package](https://www.npmjs.com/package/prompts#-types).
The `required` option can be set `true` to force the user to enter a value.

```sh
$ node examples/options.js -d wibble
✔ What is the name of the database? … wibble
✔ What is the database username? …
✔ What is the database password? …
```

### Special Options

The `yes` configuration item can be specified to have the `-y` / `--yes`
optional automatically added.  When this is specifed on the command line the
function will automatically accept the default answer.

The `verbose` configuration item can be specified to have the `-v` / `--verbose`
optional automatically added.  When this is specifed on the command line the
function will print additional output.

The `quiet` configuration item can be specified to have the `-q` / `--quiet`
optional automatically added.  When this is specifed on the command line the
function will suppress any optional output.

```js
const config = await options({
  name: 'options.js',
  description: 'Example showing command line options and prompting',
  version: '0.0.1',
  yes: true,
  verbose: true,
  quiet: true,
  options: [
    ...
  ]
})
```

```sh
$ node examples/options.js -h
Usage: options.js [options]

Example showing command line options and prompting

Options:
  -V, --version              output the version number
  -y, --yes                  Accept default answers
  -v, --verbose              Verbose output
  -q, --quiet                Quiet output
  -d, --database <text>      Database
  -u, --username <text>      Username
  -p, --password <password>  Password
  -h, --help                 display help for command
```

### commands

You can also add `commands` to the configuration. For example, you might
have a script where you want to `start` or `stop` one or more services.

```js
const config = await options({
  name: 'commands.js',
  description: 'Example showing command line commands',
  version: '0.0.1',
  verbose: true,
  quiet: true,
  commands: [
    {
      name:    'start',
      pattern: '<service>',
      about:   'Start a service'
    },
    {
      name:     'stop',
      pattern:  '<service>',
      about:    'Stop a service'
    },
    {
      name:     'status',
      about:    'Show service status'
    }
  ]
})
```

When run with the `-h` option the output will be:

```sh
$ node examples/commands.js -h
Usage: commands.js [options] [command]

Example showing command line commands.

Options:
  -V, --version       output the version number
  -v, --verbose       Verbose output
  -q, --quiet         Quiet output
  -h, --help          display help for command

Commands:
  start <service>  Start a service
  stop <service>   Stop a service
  status           Show service status
  help [command]   display help for command
```

If a command should accept multiple arguments then define the pattern
using ellipses.

```js
const config = await options({
  // ...etc...
  commands: [
    {
      name:    'start',
      pattern: '<service...>',
      about:   'Start one or more services'
    },
    // ...etc...
  ]
})
```

### Sections

If you have lots of questions then you might want to break them up
into sections.  Add an item to the `options` array like the following
to print a section title and information.  Both `title` and `info` are
optional, so you can omit either one.

```js
options: [
  {
    title: "Configuration Options",
    info:  "Please answer the following questions.\nPress RETURN to accept defaults."
  },
  ...
]
```

This generates the following output:

```sh
Configuration Options
---------------------

Please answer the following questions.
Press RETURN to accept defaults.
```

### Generated Configuration

The function returns a Promise which resolves to an object containing the
configuration values.  Each key will be the `name` of the option or command,
and the corresponding value will be that read from the command line or by
prompting the user.  In the case of [`commands`](#commands) with multiple values
they will be stored as an array.