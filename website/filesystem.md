# Filesystem Utilities

The filesystem utilities provide a simple and convenient way to handle common
directory and file operations.  These are imported from the
[badger-filesystem](https://www.npmjs.com/package/@abw/badger-filesystem)
module.

The documentation below gives a few examples of use.  See the
[badger-filesystem website](https://abw.github.io/badger-filesystem-js/)
for further documentation and examples.

## Directories

Say you've got a script in your project which needs to read a file
from a different directory.

Let's assume that the script is `bin/hello.js` and you want
to read the contents of the file in `data/hello.txt`.

The [`bin()`](https://abw.github.io/badger-filesystem-js/directories.html#bin)
function returns a `Directory` object representing the directory of the script
you're running (`process.argv[1]`).

This is useful when you want to access files relative to the script
location, regardless of where you run the script from.  The function
is so named because the traditional location for executable files in
Unix systems is the `bin` directory.

```js
import { bin } from '@abw/badger'

// current directory where the main execution script is located
const thisDir = bin();
```

You can also use it to access the directory of the current source file,
even if it's not the main script you're running.  In this case pass
`import.meta.url` as an argument.

```js
import { bin } from '@abw/badger'

// current directory where the current source file is located
const thisDir = bin(import.meta.url);
```

The `parent()` method returns the parent directory and on that
you can call the `directory()` (or `dir()` for short) method to access a
directory beneath that.  In this case, we're going for the `data`
directory.

```js
// directory where the data file is located
const dataDir = thisDir.parent().dir('data');
```

You can also use the [`dir()`](https://abw.github.io/badger-filesystem-js/directories.html#dir)
function to create a `Directory` object for any other filesystem path.  This
can be a directory relative to the current working directory:

```js
import { dir } from '@abw/badger'

const dataDir = dir('data')
```

Or specified using an absolute path:

```js
import { dir } from '@abw/badger'

const tmpDir = dir('/tmp')
```

## Reading Files

Once you have a directory object you can then use the
[`file()`](https://abw.github.io/badger-filesystem-js/directory-methods.html#file)
method to access a file in the directory.  Then call the
[`read()`](https://abw.github.io/badger-filesystem-js/file-methods.html#read)
method on that to read the file contents.

This returns a Promise which will resolve with the file content.  You can
`await` it or add a `.then()` handler to do something with the content.

```js
dataDir
  .file('hello.txt')
  .read()
  .then( text => console.log(text) )
```

You can chain all those function/method calls together like so:

```js
import { bin } from '@abw/badger'

bin(import.meta.url)
  .parent()
  .dir('data')
  .file('hello.txt')
  .read()
  .then( text => console.log(text) )
```

## Writing Files

Writing files is just as easy:

```js
import { bin } from '@abw/badger'

await bin(import.meta.url)
  .parent()
  .dir('data')
  .file('goodbye.txt')
  .write('K thx bye');
```

## File Objects

You can also use the [`file()`](https://abw.github.io/badger-filesystem-js/files.html#file)
function to create a `File` object directly.

```js
import { file } from '@abw/badger'

await file('data/goodbye.txt')
  .write('K thx bye');
```

## Further Information

For further information see the [badger-filesystem website](https://abw.github.io/badger-filesystem-js/)
which includes documentation for the
[Directory](https://abw.github.io/badger-filesystem-js/directories.html) and
[File](https://abw.github.io/badger-filesystem-js/files.html) modules.
