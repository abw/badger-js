# Project Setup

It's considered good practice to define any sensitive information (e.g.
passwords) in a `.env` environment file along with any other information that
is specific to the machine it's running on or the deployment environment
(e.g. development, staging, production, etc).

The `setup()` function can help you automate this process.  It allows you to
create a setup script that users can run when they first check out a project
to a machine, or when configuration options change.  It uses a configuration
file to define the command line arguments that the script will accept, and
will prompt the user to enter any that haven't been specified.  It will then
generate the `.env` file.

## Setup Script

You should define a setup script for your project.  A good place for this
is `bin/setup.js`.  It should look something like this:

```js
#!/usr/bin/env node
import { bin, setup } from '@abw/badger'

await setup({
  rootDir: bin().up(),
  writeEnv: true,
});
```

The `rootDir` option specifies where the root directory for your project is.
It's usually not necessary as it defaults to the current working directory.
If you run the script from the project root then it will work as expected.
But it doesn't hurt to be explicit.  Here we're using the
[`bin()`](https://abw.github.io/badger-filesystem-js/directories.html#bin) function
from [badger-filesystem](https://abw.github.io/badger-filesystem-js/) which
returns a directory object for the directory in which the script is located
(appropriately called `bin`).

The `up()` method returns the directory one level up.  If your
script is located in a lower level directory (e.g. `bin/project/setup.js`)
then you should go up another level (e.g. `bin().up(2)`).  If your script is
already in the top-level directory then `bin()` will suffice.

The benefit of being explicit is that you can then run this script from any
directory and it will work correctly.

The `writeEnv` option tells it to write a `.env` file when it's done.
The `envFile` option can be used to specify the name for the file, relative
to the `rootDir` directory.  The default is `.env`.

You'll need to define a setup configuration file to make it work.  We'll
go through that in the next section.  But first here's a sneak preview of
what happens when you run the script with an example configuration.  This
example is in [examples/setup](https://github.com/abw/badger-js/blob/master/examples/setup)
if you want to play along at home.

```bash
$ bin/setup.js

Project Configuration
---------------------

Please enter the following questions to setup the project.

✔ Where is the project root directory on this machine? … /home/abw/my-project
✔ What kind of deployment is this? › development

Database Configuration
----------------------

Enter the connection details for the database.

✔ Enter the name of the database … badger
✔ Enter the name of the database host … localhost
✔ Enter the port on which the database is running … 3306
✔ Enter the username for connecting to the database … badger
✔ Enter the password for connecting to the database … *********

Programs
--------

We need to know the location of some programs on this machine.

✔ Enter the full path to the gzip program … /usr/bin/gzip
✔ Enter the full path to the gzcat (or zcat) program … /usr/bin/gzcat

👍  All configuration options have been set
```

The script will prompt you to confirm or enter values for each of the options
in your configuration file.  It will then write a nicely formatted `.env` file
and also a `.env.yaml` file containing the raw data.

Here's what the `.env` file might look like:

```bash
#=============================================================================
# WARNING: This file is generated automatically when the undefined
# script is run.  Any changes made here may be lost.
#
# Generated: 2023-03-10 11:02:59
#=============================================================================

#-----------------------------------------------------------------------------
# Project Configuration
#-----------------------------------------------------------------------------

# Project directory
MYAPP_ROOT_DIR=/home/abw/my-project

# Deployment type
DEPLOYMENT=development


#-----------------------------------------------------------------------------
# Database Configuration
#-----------------------------------------------------------------------------

# Database name
DB_NAME=badger

# Database host
DB_HOST=localhost

# Database port
DB_PORT=3306

# Database user
DB_USER=badger

# Database password
DB_PASS=TOP_SECRET


#-----------------------------------------------------------------------------
# Programs
#-----------------------------------------------------------------------------

# Path to gzip
GZIP=/usr/bin/gzip

# Path to gzcat (or zcat)
GZCAT=/usr/bin/gzcat
```

The `-v` or `--verbose` options can be added to get some extra messages
generated.  The `-h` or `--help` options can be used to view the help for the
script:

```bash
$ bin/setup.js -h
Usage: bin/setup.js [options]

Project setup script.

Options:
  -y, --yes              Accept default answers
  -v, --verbose          Verbose output
  -q, --quiet            Quiet output
  --root <dir>           Project directory (default: "/home/abw/my-project")
  --deployment <type>    Deployment type (default: "development")
  --db_name <dbname>     Database name (default: "badger")
  --db_host <hostname>   Database host (default: "localhost")
  --db_port <port>       Database port (default: 3306)
  --db_user <username>   Database user (default: "badger")
  --db_pass <password>   Database password
  --gzip <path>          Path to gzip (default: "/usr/bin/gzip")
  --gzcat <path>         Path to gzcat (or zcat) (default: "/usr/bin/gzcat")
  -h, --help             display help for command
```

In this example the options from `--deployment` down to `--gzcat` are specific
to the configuration file and everything else comes as standard.

If you need to change an option you can go through the questions over again
(it will remember the answers you previously gave by looking at the generated
`.env` and/or `.env.yaml` files), or you can use a command line option to
set the relevant value along with `-y` or `--yes` to automatically accept all
the other value.  The `-q` or `--quiet` option can be used to supress any
other output.

For example, to update the database password:

```bash
$ bin/setup.js --db_pass NEWPASSWORD -y -q
```

The `.env` file will then be re-generated with the new value for `DB_PASS`.

## Configuration file

You need to define a configuration file to tell the script what data you
need to capture.  It can be in any one of the standard locations, relative
to your project root:

* `config/setup.yaml`
* `config/setup.json`
* `setup.yaml`
* `setup.json`
* `.setup.yaml`
* `.setup.json`

You can use the `configFile` option to specify a different location if you
don't like the look of any of those.

Here's the configuration file used in the earlier example.

```yaml
# standard options
yes:            true
verbose:        true
quiet:          true

# custom project options
options:
  #---------------------------------------------------------------------------
  # Project
  #---------------------------------------------------------------------------
  -
    title:      Project Configuration
    info:       Please answer the following questions to setup the project.
  -
    name:       root
    about:      Project directory
    prompt:     Where is the project root directory on this machine?
    pattern:    <dir>
    required:   true
    envvar:     MYAPP_ROOT_DIR
  -
    name:       deployment
    about:      Deployment type
    prompt:     What kind of deployment is this?
    type:       select
    pattern:    <type>
    required:   true
    default:    development
    choices:
      -
        title:  development
        value:  development
      -
        title:  staging
        value:  staging
      -
        title:  production
        value:  production

  #---------------------------------------------------------------------------
  # Database
  #---------------------------------------------------------------------------
  -
    title:      Database Configuration
    info:       Enter the connection details for the database.
  -
    name:       db_name
    about:      Database name
    prompt:     Enter the name of the database
    pattern:    <dbname>
    required:   true
    default:    badger
  -
    name:       db_host
    about:      Database host
    prompt:     Enter the name of the database host
    pattern:    <hostname>
    required:   true
    default:    localhost
  -
    name:       db_port
    about:      Database port
    prompt:     Enter the port on which the database is running
    pattern:    <port>
    required:   true
    default:    3306
  -
    name:       db_user
    about:      Database user
    prompt:     Enter the username for connecting to the database
    pattern:    <username>
    required:   true
    default:    badger
  -
    name:       db_pass
    about:      Database password
    prompt:     Enter the password for connecting to the database
    pattern:    <password>
    type:       password
    required:   true

  #---------------------------------------------------------------------------
  # Programs
  #---------------------------------------------------------------------------
  -
    title:      Programs
    info:       We need to know the location of some programs on this machine.
  -
    name:       gzip
    about:      Path to gzip
    program:    gzip
    prompt:     Enter the full path to the gzip program
    mandatory:  true
  -
    name:       gzcat
    about:      Path to gzcat (or zcat)
    program:    gzcat zcat
    prompt:     Enter the full path to the gzcat (or zcat) program
    mandatory:  true
```

The first section contains the standard options that enable the `-y` / `--yes`,
`-v` / `--verbose` and `-q` / `--quiet` options.

```yaml
# standard options
yes:            true
verbose:        true
quiet:          true
```

Following that we have the `options` section.  Each option must contain a
`name` and can have various other parameters.

```yaml
options:
  -
    name:       root
    envvar:     MYAPP_ROOT_DIR
    about:      Project directory
    prompt:     Where is the project root directory on this machine?
    required:   true
    pattern:    <dir>
  # ...etc.
```

The `name` is used as the command line option for the script, e.g. `--root`.
If an `envvar` is defined then this will be the name used for the environment
variable in the `.env` file (`MYAPP_ROOT_DIR` in this example).  Otherwise it
defaults to an upper can version of the `name` (e.g. `ROOT`).

If you don't want an answer to be saved either in the `.env` file or in the
cached answers file then set the `save` property to `false`.

```yaml
    save:       false
```

The `about` property is displayed in the help text.  It will also be added as
a comment to the `.env` file.  The `prompt` is the prompt used to request user
input.  If this is not defined then the user will not be prompted to enter a
value for it.  The `pattern` is displayed against the option in the help text,
e.g.

```bash
   --root <dir>           Project directory (default: ...)
```

If you don't specify it then it defaults to `<text>` (or `<path>` for program
options)

The `required` flag indicates that a value must be provided.

The default input type is `text`, but you can explicitly set it to `password`
where appropriate:

```yaml
  -
    name:       db_pass
    about:      Database password
    prompt:     Enter the password for connecting to the database
    pattern:    <password>
    type:       password
    required:   true
```

The `select` type can be be used to provide a list of values to select from:

```yaml
  -
    name:       deployment
    about:      Deployment type
    prompt:     What kind of deployment is this?
    type:       select
    pattern:    <type>
    required:   true
    default:    development
    choices:
      -
        title:  development
        value:  development
      -
        title:  staging
        value:  staging
      -
        title:  production
        value:  production
```

The `program` option provides some extra magic.  It will look for the named
program in your `PATH` and set the default value to be the first location
it finds.

```yaml
  -
    name:       gzip
    about:      Path to gzip
    program:    gzip
    prompt:     Enter the full path to the gzip program
    mandatory:  true
```

If you don't set the `pattern` for a `program` option then it defaults to
`<path>`.  If there are different names for acceptable programs then you
can specify multiple values to the `program` option.  For example, `gzcat`
and `zcat` both do the same thing.

```yaml
    program:    gzcat zcat
```

Lots of questions can be a bit overwhelming to a user.  You can break them
up into sections to relieve the monotony by defining a `title` option.

```yaml
  -
    title:      Programs
    info:       We need to know the location of some programs on this machine.
```

## Setup Options

Here's a summary of the options that you can pass to the `setup()`
function.

|Option|Description|Default|
|-|-|-|
|rootDir|Your project root directory|Current working directory|
|description|A description for the help text|Project setup script.|
|version|The version number for the help text||
|configFile|The path to your setup configuration file, relative to `rootDir`|`config/setup.yaml`, `config/setup.json`, `setup.yaml`, `setup.json`, `.setup.yaml` or `.setup.json`|
|values|Default answers for values||
|preprocess|A function to pre-process the setup configuration file after loading|`false`|
|envFile|The name of your environment file, relative to `rootDir`|`.env`|
|writeEnv|Should it automatically write the `envFile` file?|`false`|
|envExtra|Additional file to append to `envFile`, e.g. `.env.extra`||
|envSections|Add section block comments to `envFile`|`true`|
|envComments|Add item comments to `envFile`|`true`|
|compact|Don't add blank spacing lines in `envFile`|`false`|
|dataFile|JSON or YAML file for caching answers|`.env.yaml`|
|writeData|Should it automatically write the `dataFile` file?|`true`|
|cancelled|Text to display when script is cancelled (by hitting escape or Ctrl-C)|`Setup cancelled`|
|allDone|Text to display when all questions have been answered|`All configuration options have been set`|
|warning|Warning text to add to top of `envFile`|(WARNING text block)|

