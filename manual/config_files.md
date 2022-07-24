# Configuration Files

We all know (hopefully) that it's considered harmful to hard-code values in code
that might conceivably change at some point.  Furthermore, the DRY (Don't
Repeat Yourself) principle tells us that _"Every piece of knowledge must
have a single, unambiguous, authoritative representation within a system"_.

So it's good practice to have a single location where configuration options for your
project can be stored.  For a smaller projects this might be a single configuration
file (e.g. consider how `package.json` is used for NPM modules). For larger projects
you may choose to have several configuration files to achieve a better separation
of concerns and to make them easier to manage.

- [Config Object](#config-object)
- [Config Directory](#config-directory)
- [Multiple Config Directories](#multiple-config-directories)
- [Loading a Config File](#loading-a-config-file)
- [Data Path](#data-path)
- [Configuration Options](#configuration-options)
- [Benefits](#benefits)

## Config Object

The [Config](../class/src/Badger/Config.js~Config) module simplifies the process
of reading configuration files stored in a central location.  Tell it where your
configuration files are stored and then it will take care of loading them for you.

```js
import { Config } from '@abw/badger'

// look for config files in a `config` directory
const configDir = new Config('config')

// load the badger.(js|mjs|yaml|json) file
configDir.config('badger').then(
  config => console.log("loading the badger config: ", config)
)
```

## Config Directory

When you create a new `Config` object you should specify the name of the
configuration directory relative to your current location.

```js
const configDir = new Config('config')
```

You can specify it as a string as shown above, or using a
[Directory](../class/src/Badger/Filesystem/Directory.js~Directory) object as
shown in the earlier examples. For example, if you have a script in the `bin`
directory and you want to load configuration files from the `config` directory
located alongside it then you can do something like this:

```js
import { bin, Config } from '@abw/badger'

const configDir = new Config(
  bin(import.meta.url).parent().dir('config')
)
```

Or more succinctly like this:

```js
import { bin, Config } from '@abw/badger'

const configDir = new Config(
  bin(import.meta.url).dir('../config')
)
```

## Multiple Config Directories

If you have multiple locations that you want to read configuration files
from then you can specify them as an array.  The values of the array can be
either Directory objects or strings, or a mixture of the two.  For example if
you want to read configuration files from your project root directory and/or a
`config` directory then you could do this:

```js
const rootDir = bin(import.meta.url).parent()

const configDir = new Config(
  [rootDir, rootDir.dir('config')]
)
```

## Loading a Config File

The `config()` method expects the basename (i.e. no file extension) of a file
in your config directory (or one of them).

```js
// load the badger.(js|mjs|yaml|json) file
configDir.config('badger').then(
  config => console.log("loaded the badger config: ", config)
)
```

### Javascript Files

It will first look for a Javascript file with a `.js` or `.mjs` extension.
If it finds such a file then it will import it and return a Promise that
fulfills with the exports from that file.  For example, a `config/badger.js`
file might look like this:

```js
export const name="Brian";
export const animal="Badger";
```

### YAML or JSON Files

If it doesn't find a Javascript file then it will look for a `yaml` or `json`
file.  For example, a `config/badger.yaml` might look like this:

```yaml
name:   Brian
animal: Badger
```

Or a `config/badger.json` might look like this:

```json
{
  "name":   "Brian",
  "animal": "Badger"
}
```

In all the above cases, the same data will be returned in the Promise.

```js
configDir.config('badger').then(
  // prints "Brian is a Badger"
  config => console.log(config.name, "is a", config.animal)
)
```

## Data Path

If you want to access a particular piece of data from the loaded configuration
then you can specify it as a data path fragment following the file name.  Separate the
file name and data path fragment with a `#`.

```js
// load the default export from the badger.(js|mjs) file
configDir.config('badger#name').then(
  name => console.log("The badger is called", name)
)
```

See the [Data Paths](./manual/data_paths) documentation for further information.

## Configuration Options

The `jsExt` configuration option can be used to change the file extensions
that are recognised for Javascript files (`['js', 'mjs']` by default) and
the `codec` option can be used to specify which codecs can be used for
data files (`['yaml', 'json']` by default).  Note that the names of the
`codec` correspond to the file extensions, e.g. a file must have a `.yaml`
extension to be reconised and read using the `yaml` codec.

For example, if you only want to look for `.js` Javascript files and `.json`
data files then you would set the options like this:

```js
const configDir = new Config(
  rootDir.dir('config'),
  {
    jsExt: ['js'],
    codec: ['json'],
  };
)
```

Or, given that you now only have one value for each of `jsExt` and `codecs` you
could do it like this:

```js
const configDir = new Config(
  rootDir.dir('config'),
  {
    jsExt: 'js',
    codec: 'json',
  };
)
```

## Benefits

In case it's not immediately obvious, one key benefit of using the Config module to
load configuration files is that it allows you to change the format that you're
using at any time.  You might start off with a simple `.json` JSON file then later decide
that you want to change to a `.yaml` YAML file so that you can add some comments and whitespace
to make it more readable.  Further down the line you might need to perform some
computation and switch it to a `.js` Javascript file.

Of course you still need to re-write your configuration file but you don't need to worry about
updating any code that's loading it.  When you add a `badger.yaml` file to the configuration
directory it will immediately take precedence over the `badger.json` file, or if you add a
`badger.js` file it will take precedence over both the `badger.yaml` and `badger.json` files.

This is why you should **NOT** provide the file extension in the name you pass to the
`config()` method.  Leave it up to the `config()` method to work that out for you
and do the right thing.

