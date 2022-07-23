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
Then call the `lib()` method to load a `.js` or `.mjs` module from any of those
directories.

```js title="bin/configLoaderExample.js"
import { Library } from '@abw/badger'

const library = new Library(
  ['src', 'lib']
)

// load first of src/Example.js, src/Example.mjs, lib/Example.js or lib/Example.mjs
library.lib('Example').then(
  code => {
    // do something with your code here
  }
)
```
