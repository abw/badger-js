---
outline: deep
---
# Workspace

The `Workspace` module provides a convenient "hub" for accessing directories,
files, configuration files, libraries and other resources for your project.

## Workspace

Create a new Workspace object and provide it with the workspace directory.
This is usually the top-level directory of your project.

```js
import { Workspace } from '@abw/badger'

const workspace = new Workspace('/path/to/project')
```

You can specify an absolute directory path, the path of a directory relative to
your current location, or a [`Directory`](filesystem) directory object.
The [`bin()`](https://abw.github.io/badger-filesystem-js/directories.html#bin)
function can be used to determine the directory in which a script is located.

For example, if you have a `bin/myscript.js` file, you can create a workspace
for the parent directory like so:

```js
import { bin, Workspace } from '@abw/badger'

const workspace = new Workspace(
  bin().parent()
)
```

There's also a `workspace()` function as a shortcut.  You just need to
remember to not call your workspace `workspace`.

```js
import { bin, workspace } from '@abw/badger'

const mySpace = workspace(
  bin().parent()
)
```

## dir()

The `dir()` method is a shortcut to fetch a
[`Directory`](https://abw.github.io/badger-filesystem-js/directories.html)
object for any directory relative to the workspace directory.

```js
const tmpdir = workspace.dir('tmp');
```

## file()

The `file()` method is a shortcut to fetch a
[`File`](https://abw.github.io/badger-filesystem-js/files.html)
object for any file relative to the workspace directory.

```js
const wibble = workspace.file('tmp/wibble.log');
```

## config()

The `config()` method is a shortcut to load data from a configuration file
using the [`Config`](config-files) module.

The default location for configuration files is the `config` directory
relative to the workspace directory.  See
[configuration options](#configOptions) below for details on how to change
this.

```js
workspace
  .config('animals')
  .then(
    data => console.log("Data from the animals config file", data)
  )
```

## library()

The `library()` method is a shortcut to load a Javascript library from one
of the library directories using the [`Library`](library-modules) module.

The default search path for library files is any of the `lib`, `library`,
`src` or `components` directories relative to the workspace directory.  See
[configuration options](#configOptions) below for details on how to change this.

```js
workspace
  .library('animals')
  .then(
    data => console.log("Data from the animals library file", data)
)
```

## component()

The `component(uri, props)` method can be called to create a new component
object.  The `uri` argument should be the base name of the component.

If there is a configuration file matching the `uri` in the configuration directory
then it will be loaded (via the [`config()`](#config) and used as
the default configuration for the object.  The optional `props` can be defined
to refine this configuration.

The corresponding library file will then be loaded from the library directory
(via the [`library()`](#library) method). This should have a default export
which is the component class, implemented as a subclass of the `Component`
base class.

An instance of the component class is then instantiated, passing a reference to the
workspace and the configuration options.

```js
workspace
  .component('Hello')
  .then(
    hello => console.log('loaded hello component: ', hello)
  )
```

The above example is roughly equivalent to:

```js
workspace
  .config('Hello')
  .then(
    config => workspace.library('Hello')
  )
  .then(
    library => new library.default(workspace, config)
  )
  .then(
    hello => console.log('loaded Hello component: ', hello)
  )
)
```

The default behaviour is to look for configuration and library files with
the same case as specified.  For example, requesting a component named
`my/component` will look for a `my/component.(js|mjs|yaml|json)`
configuration file and a `my/component.(js|mjs)` library file.

The `case` option can be used to provide functions for mapping `config` or
`library` file names to a different case.  For example, if your
configuration files use snake case but your library modules are defined
in Pascal case (aka StudlyCaps), then you can map the `library` names using
the [`snakeToStudly()`](https://abw.github.io/badger-utils/text.html#snakeToStudly)
function provided by [@abw/badger-utils](https://github.com/abw/badger-utils).

```js
import { Workspace } from '@abw/badger'
import { snakeToStudly } from '@abw/badger-utils'

const workspace = new Workspace(
  '/path/to/project',
  case: {
    library: snakeToStudly
  }
)

// config file should be something like config/my/component.yaml
// library file should be something like lib/My/Component.js
workspace
  .component('my/component')
  .then(
    MyComponent => {
      // do something
    }
  )
```

## Configuration Options {#configOptions}

### config

The `config` option can be provided to configure the [`Config`](config-files)
object that the workspace used to load configuration files.

```js
const workspace = new Workspace(
  '/path/to/workspace',
  {
    config: {
        dir:   'cfg',
        codec: 'json',
        jsExt: 'js',
    }
  }
)
```

You can specify multiple directories to search for configuration files.

```js
const workspace = new Workspace(
  '/path/to/workspace',
  {
    config: {
      dir:   ['cfg', 'config'],
    }
  }
)
```

### library

The `library` option can be provided to configure the [`Library`](library-modules)
object that the workspace used to load Javascript libraries.

```js
const workspace = new Workspace(
  '/path/to/workspace',
  {
    library: {
      dir:   'lib',
      jsExt: 'js',
    }
  }
)
```

You can specify multiple directories to search for Javascript libraries.

```js
const workspace = new Workspace(
  '/path/to/workspace',
  {
    library: {
      dir: ['src', 'lib'],
    }
  }
)
```
