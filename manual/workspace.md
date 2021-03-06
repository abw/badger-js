# Workspace

The [Workspace](class/src/Badger/Workspace.js~Workspace) module provides a
convenient "hub" for accessing directories, files, configuration files,
libraries and other resources for your project.

- [Workspace Directory](#workspace-directory)
- [Directories](#directories)
- [Files](#files)
- [Configuration Files](#configuration-files)
- [Javscript Libraries](#javascript-libraries)
- [Configuration Options](#configuration-options)

## Workspace Directory

Create a new Workspace object and provide it with the workspace directory.
This is usually the top-level directory of your project.

```js
import { Workspace } from '@abw/badger'

const workspace = new Workspace('/path/to/project')
```

You can specify an absolute directory path, the path of a directory relative to
your current location, or a [Directory](class/src/Badger/Directory.js~Directory)
directory object.  The [bin](function#static-function-bin) function can be used to
determine the directory in which a script is located.

For example, if you have a `bin/myscript.js` file, you can create a workspace
for the parent directory like so:

```js
import { bin, Workspace } from '@abw/badger'

const workspace = new Workspace(
  bin(import.meta.url).parent()
)
```

## Directories

The [dir()](class/src/Badger.js~Workspace#instance-method-dir) method is a shortcut
to fetch a [Directory](class/src/Badger/Filesystem/Directory.js~Directory) object for any
directory relative to the workspace directory.

```js
const tmpdir = workspace.dir('tmp');
```

## Files

The [file()](class/src/Badger.js~Workspace#instance-method-file) method is a shortcut
to fetch a [File](class/src/Badger/Filesystem/File.js~File) object for any
file relative to the workspace directory.

```js
const wibble = workspace.file('tmp/wibble.log');
```

## Configuration Files

The [config()](class/src/Badger.js~Workspace#instance-method-config) method is a shortcut
to load data from a configuration file using the [Config](class/src/Badger/Config.js~Config)
module.

The default location for configuration files is the `config` directory relative to the workspace
directory.  See [configuration options](#config-options) below for details on how to change this.

```js
workspace.config('animals').then(
  data => console.log("Data from the config/animals(.js|.mjs|.yaml|.json) file", data)
)
```

## Javascript Libraries

The [library()](class/src/Badger.js~Workspace#instance-method-library) method is a shortcut
to load a Javascript library from one of the library directories using the
[Library](class/src/Badger/Library.js~Library) module.

The default search path for libary files is any of the `lib`, `library`, `src` or `components`
directories relative to the workspace directory.  See [configuration options](#config-options)
below for details on how to change this.

```js
workspace.config('animals').then(
  data => console.log("Data from the config/animals(.js|.mjs|.yaml|.json) file", data)
)
```

## Javascript Components

The [component(uri, props)](class/src/Badger.js~Workspace#instance-method-component) method can
be called to create a new component object.  The `uri` argument should be the base name of the
component.

If there is a configuration file matching the `uri` in the configuration directory
then it will be loaded (via the
[config(uri)](class/src/Badger.js~Workspace#instance-method-config) method) and used as
the default configuration for the object.  The optional `props` can be defined
to refine this configuration.

The corresponding library file will then be loaded from the library directory
(via the [library(uri)](class/src/Badger.js~Workspace#instance-method-library) method).
This should have a default export which is the component class, implemented as a subclass
of the [Component](class/src/Badger/Component.js~Component) base class.

An instance of the component class is then instantiated, passing a reference to the
workspace and the configuration options.

```js
workspace.component('Hello').then(
  hello => console.log('loaded hello component: ', hello)
)
```

The above example is roughly equivalent to:

```js
workspace.config('Hello').then(
  config => workspace.library('Hello')
    .then( library => new library.default(workspace, config) )
    .then( hello => console.log('loaded Hello component: ', hello) )
)
```

## Configuration Options

The `config` option can be provided to configure the [Config](class/src/Badger/Config.js~Config)
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

The `library` option can be provided to configure the [Library](class/src/Badger/Library.js~Library)
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
