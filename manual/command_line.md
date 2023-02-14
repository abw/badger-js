# Command Line Options

The [options](function#static-function-options) function provides an
integrated way to process command line arguments (using [commander](https://www.npmjs.com/package/commander))
and prompt the user for any missing configuration options (using [prompts](https://www.npmjs.com/package/prompts)).

- [Simple Example](#simple-example)
- [Special Options](#special-options)
- [Commands](#commands)
- [Sections](#sections)
- [Generated Configuration](#generated-configuration)

## Simple Example

This simple example shows how options are specified.

```js
const config = await options({
  name: 'options.js',
  version: '0.0.1',
  description: 'Example showing command line options and prompting',
  options: [
    {
      name:     'database',
      short:    'd',
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
  -d, --database &lt;text&gt;      Database
  -u, --username &lt;text&gt;      Username
  -p, --password &lt;password&gt;  Password
  -h, --help                 display help for command
```

The `name`, `version` and `description` are optional items that will be displayed in
the help.

The `options` array defines the valid options.  Each can have a `name` which is
accessible as the "long option", e.g. `--database`, `--username` and `--password`,
and a `short` option, e.g. `-d`, `-u` and `-p`.  The `about` item provides information
about the option.

After processing the command line arguments, the function will prompt the user to
confirm any values specified as arguments, and enter any missing values.  The `prompt`
item is used to prompt the user.  If this is omitted then the user will not be prompted
to enter a value.  The `type` can be set to one of the [types provided by the prompts
package](https://www.npmjs.com/package/prompts#-types).  The `required` option can be
set `true` to force the user to enter a value.

```sh
$ node examples/options.js -d wibble
✔ What is the name of the database? … wibble
✔ What is the database username? …
✔ What is the database password? …
```

## Special Options

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

## Commands

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

## Sections

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

## Generated Configuration

The function returns a Promise which fulfills to an object containing the
configuration values.  Each key will be the `name` of the option or command,
and the corresponding value will be that read from the command line or by
prompting the user.  In the case of [commands](#commands) the value or values
will be in an array.