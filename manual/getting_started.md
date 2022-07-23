# Getting Started

The `badger` toolkit provides a range of classes and utility
functions for server-side Javascript using Node.js.

There is no particular rhyme or reason as to what's included
or excluded from the toolkit.  It contains the kind of things
that I've found to be useful to help build and manage
non-trivial software projects.

## File Utilities

Let's start with the file utilities.  Say you've got a script
in your project which needs to read a file from a different
directory.

Let's assume that the script is `bin/hello.js` and you want
to read the contents of the file in `data/hello.txt`.  The
`bin` function accepts the URL of the source file which you
can get from `import.meta.url` and returns an object
representing the directory that it's in.  Note that this will
always be the same directory regardless of where you run the
script from.

```js title="bin/hello.js"
import { bin } from '@abw/badger'

// current directory where this script is located
const thisDir = bin(import.meta.url);
```

The `parent()` method returns the parent directory and on that
we can call the `directory()` (or `dir()` for short) method to access a
directory beneath that.  In this case, we're going for the `data`
directory.

```js
// directory where the data file is located
const dataDir = thisDir.parent().dir('data');
```

We can then access the `hello.txt` file in that directory and
read the file content using the `read()` method.  This returns
a Promise which will fulfull with the file content.  Add a
`.then()` handler to do something with the content.

```js
dataDir.file('hello.txt').read().then(
  text => console.log(text)
)
```

We can chain all those function/method calls together like so:

```js title="bin/animal.js"
import { bin } from '@abw/badger'

bin(import.meta.url)
  .parent()
  .dir('data')
  .file('hello.txt')
  .read()
  .then( text => console.log(text) )
```

Writing files is just as easy:

```js title="bin/goodbye.js"
import { bin } from '@abw/badger'

bin(import.meta.url)
  .parent()
  .dir('data')
  .file('goodbye.txt')
  .write('K thx bye');
```

For further information see the documentation for the
[Directory](../class/src/Badger/Filesystem/Directory.js~Directory) and
[File](../class/src/Badger/Filesystem/File.js~File) modules.

## Codecs

Codecs are used to encode and decode data to and from serialised text.  The badger toolkit comes with two built-in codecs for `json` and `yaml` files.

Suppose that we have a `badger.yaml` file in the `data` directory that we
want to read.

```yaml title="data/animal.yaml"
name:   Brian
animal: Badger
```

All we have to do is add the `{ codec: "yaml" }`
options to the `file()` method.  The `read()` method will then
automatically decode the YAML text.

```js title="bin/animal.js"
import { bin } from '@abw/badger'

bin(import.meta.url)
  .parent()
  .directory('data')
  .file('badger.yaml', { codec: 'yaml' })
  .read().then(
    data => console.log(data.name, 'is a', data.animal)
  )
```

This prints the string "Brian is a Badger" to the console.

The `codec` option also works when writing data.

```js title="bin/giraffe.js"
import { bin } from '@abw/badger'

bin(import.meta.url)
  .parent()
  .directory('data')
  .file('giraffe.yaml', { codec: 'yaml' })
  .write({
    name:   "Gerald",
    animal: "Giraffe",
  })
```

You should now have a `data/giraffe.yaml` file containing the following:

```yaml title="data/giraffe.yaml"
name: Gerald
animal: Giraffe
```

## Configuration Files

We all know (hopefully) that it's considered harmful to hard-code values in code
that might conceivably change at some point.  Furthermore, the DRY (Don't
Repeat Yourself) principle tells us that _"Every piece of knowledge must
have a single, unambiguous, authoritative representation within a system"_.

So it's good practice to have a single location where configuration options for your
project can be stored.  For a smaller projects this might be a single configuration
file (e.g. consider how `package.json` is used for NPM modules). For larger projects
you may choose to have several configuration files to achieve a better separation
of concerns and to make them easier to manage.

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

When you create a new `Config` object you should specify the name of the
configuration file relative to your current location.

```js
const configDir = new Config('config')
```

You can specify it as a string as shown above, or using a
[Directory](../class/src/Badger/Filesystem/Directory.js~Directory) object as
shown in the earlier examples. For example, if you have a script in the `bin`
directory and you want to load configuration files from the `config` directory
located alongside it then you can do something like this:

```js title="bin/configLoaderExample.js"
import { bin, Config } from '@abw/badger'

const configDir = new Config(
  bin(import.meta.url).parent().dir('config')
)
```

Or more succinctly like this:

```js title="bin/configLoaderExample.js"
import { bin, Config } from '@abw/badger'

const configDir = new Config(
  bin(import.meta.url).dir('../config')
)
```

If you have multiple locations that you want to read configuration files
from then you can specify them as an array.  The values of the array can be
either Directory objects or strings, or a mixture of the two.  For example if
for some reason you have a `config` directory and a `system` directory that
you want to read configuration files from then you could do this:

```js
const rootDir = bin(import.meta.url).parent()

const configDir = new Config(
  [rootDir.dir('config'), rootDir.dir('system')]
)
```

The `config()` method expects the basename (i.e. no file extension) of a file
in your config directory (or one of them).

```js
// load the badger.(js|mjs|yaml|json) file
configDir.config('badger').then(
  config => console.log("loaded the badger config: ", config)
)
```

It will first look for a Javascript file with a `.js` or `.mjs` extension.
If it finds such a file then it will import it and return a Promise that
fulfills with the exports from that file.  For example, a `config/badger.js`
file might look like this:

```js title="config/badger.js"
export const name="Brian";
export const animal="Badger";
```

If it doesn't find a Javascript file then it will look for a `yaml` or `json`
file.  For example, a `config/badger.yaml` might look like this:

```yaml title="config/badger.yaml"
name:   Brian
animal: Badger
```

Or a `config/badger.json` might look like this:

```json title="config/badger.json"
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

The `jsExt` configuration option can be used to change the file extensions
that are recognised for Javascript files (`['js', 'mjs']` by default) and
the `codecs` option can be used to specify which codecs can be used for
data files (`['yaml', 'json']` by default).  Note that the names of the
`codecs` correspond to the file extensions, e.g. a file must have a `.yaml`
extension to be reconised and read using the `yaml` codec.

For example, if you only want to look for `.js` Javascript files and `.json`
data files then you would set the options like this:

```js
const configDir = new Config(
  rootDir.dir('config'),
  {
    jsExt:  ['js'],
    codecs: ['json'],
  };
)
```

Or, given that you now only have one value for each of `jsExt` and `codecs` you
could do it like this:

```js
const configDir = new Config(
  rootDir.dir('config'),
  {
    jsExt:  'js',
    codecs: 'json',
  };
)
```

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

## Library Modules

The [Library](../class/src/Badger/Library.js~Library) module is similar to the
[Config](../class/src/Badger/Config.js~Config) module except that it's designed to
work only with Javascript files.

Create a library directory specifying one or more directories where your code is located.
Then call the `library()` method to load a `.js` or `.mjs` module from any of those
directories.

```js title="bin/configLoaderExample.js"
import { Library } from '@abw/badger'

const libraryDir = new Library(
  ['src', 'lib']
)

// load first of src/Example.js, src/Example.mjs, lib/Example.js or lib/Example.mjs
libraryDir.library('Example').then(
  exports => {
    // do something with your code exports here
  }
)
```

The Promise returned fulfills to an object containing all the exports from your library
module.

## Data Paths

Both the [Config](../class/src/Badger/Config.js~Config) and
[Library](../class/src/Badger/Library.js~Library) modules provide a
convenient way to drill down into the data returned to fetch a particular item.

For example, suppose you have the following configuration file in `config/zoo.yaml`.

```yaml title="config/zoo.yaml"
animals:
  aardvark:
    name: Alan
  badger:
    name: Brian
  cat:
    name: Colin
```

If you have a Config object setup to read files from the `config` directory then
you can read the whole of the `zoo` data set like this:

```js
configDir.config('zoo').then(
  zoo => console.log("The badger is called ", zoo.animals.badger.name) // The badger is called Brian
)
```

If you're only looking for a particular item, in this case the name of the badger,
then you can add a data path fragment to the file name, like this:

```js
configDir.config('zoo#animals/badger/name').then(
  name => console.log("The badger is called ", name) // The badger is called Brian
)
```

Each element of the data path should be separated by a slash.  You can specify
text elements to access items in an object (as shown above) or numerical elements to
access items in an array.

For example, if you have some data that looks like this:

```json
{
  "numbers": ["zero", "one", "two", "forty-two"],
  "friends": [
    { "name": "Ford Prefect" },
    { "name": "Zaphod Beeblebrox" },
    { "name": "Trillian" },
  ]
}
```

Then a data path of `numbers/3` would return "forty-two", or `friends/0/name` would return
"Ford Prefect".

If an item is `undefined` or `null` then an error is thrown.  Using the above data this would
happen if you tried to access `friends/12/name` or `friends/0/birthday`

You can add an question mark to the end of a path segment to make it silently return `undefined`
instead, e.g. `friends/12?/name` or `friends/0/birthday?`.  Note that the question mark can only
appear at the end of a segment.  If it appears anywhere else then it is assumed to be the same
thing as `?/`.  e.g. `foo?bar` is the same as `foo?/bar`.

You can enclose any segment in single or double quotes if you happen to have data keys that include
`/` or `?` characters in them.  For example, `question/"What is the answer?"` to access the value
"42" in the following data:

```json
{
  "question": {
    "What is the answer?": 42
  }
}
```

If you want to make a quoted part optional then add the question mark after the closing quote, e.g.
`question/"What is the question?"` would throw an error because it is not defined, but can be specified
as `question/"What is the question?"?` to instead return `undefined`.

The data path syntax is intentionally simple and limited.  If you want to do anything more complicated
then you should consider using JSON Path instead.

All of the above applies to the data returned by the Config and Library modules when loaded
Javascript files.  By default they will return an object containing all exported values from the
Javascript file.  If you want to access the `default` export, for example, then you can add a `#default` suffix
to the file basename when loading it.

```js
libraryDir.library('Example#default').then(
  default => {
    // do something with the default export here
  }
)
```

Any other named export can be accessed in the same way.

```js
libraryDir.library('Example#anotherExport').then(
  anotherExport => {
    // do something with anotherExport here
  }
)
```
