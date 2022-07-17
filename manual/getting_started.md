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
[Directory](/class/src/Badger/Filesystem/Directory.js~Directory) and
[File](/class/src/Badger/Filesystem/File.js~File) modules.

## Codecs

Codecs are used to encode and decode data to and from serialised text.  The badger toolkit comes with two built-in codecs for `json` and `yaml` files.

Suppose that we have a YAML file in the data directory that we
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
  .file('animal.yaml', { codec: 'yaml' })
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
