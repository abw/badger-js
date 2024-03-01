# Data Paths

Both the [`Config`](config-files) and [`Library`](library-modules) modules
provide a convenient way to drill down into the data returned to fetch a
particular item.

This uses the `dataPath()` function which navigates data using a URL-like
path. The data path syntax is intentionally simple and limited. If you want
to do anything more complicated then you should consider using JSON Path instead.

## Config Files

Suppose you have the following configuration file in `config/zoo.yaml`.

```yaml
animals:
  aardvark:
    name: Alan
  badger:
    name: Brian
  cat:
    name: Colin
```

If you have a [`Config`](config-files) object setup to read files from the
`config` directory then you can read the whole of the `zoo` data set like this:

```js
use { Config } from '@abw/badger'

const configDir = new Config('config');

configDir
  .config('zoo')
  .then(
    zoo => console.log(
      "The badger is called ",
      zoo.animals.badger.name
    ) // The badger is called Brian
  )
```

If you're only looking for a particular item, in this case the name of the
badger, then you can add a data path fragment to the file name, like this:

```js{2}
configDir
  .config('zoo#animals/badger/name')
  .then(
    name => console.log(
      "The badger is called ",
      name
    ) // The badger is called Brian
  )
```

Each element of the data path should be separated by a slash. You can specify
text elements to access items in an object (as shown above) or numerical
elements to access items in an array.

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

Then a data path of `numbers/3` would return "forty-two", or `friends/0/name`
would return "Ford Prefect".

## Optional Items

If an item specified in the path is `undefined` or `null` then an error is
thrown. Using the above data this would happen if you tried to access
`friends/12/name` or `friends/0/birthday`

You can add an question mark to the end of a path segment to make it silently
return `undefined` instead, e.g. `friends/12?/name` or `friends/0/birthday?`.

Or you can add a question mark to the start of a path segment and it will
return whatever it has matched so far, e.g. `friends/?12/name` will return
the `friends` array, or `friends/0/?birthday` will return the 0th friend,
`{ "name": "Ford Prefect" }`.

You can also use question marks as segment separators.  In this case they are
assumed to be marking the end of the previous segment, e.g. `foo?bar` is the
same as `foo?/bar`.

## Quoted Path Segments

You can enclose any segment in single or double quotes if you happen to have
data keys that include `/` or `?` characters in them. For example,
`question/"What is the answer?"` to access the value "42" in the following
data:

```json
{
  "question": {
    "What is the answer?": 42
  }
}
```

If you want to make a quoted part optional then add the question mark after
the closing quote, e.g. `question/"What is the question?"` would throw an
error because it is not defined, but can be specified as `question/"What is
the question?"?` to instead return `undefined`.

Note that the usual Javascript rules for quoted strings apply. e.g. use `\n`
to encode a newline, `\"` to escape a double quote inside a double quoted
string, and so on.

## Javascript Library Exports

All of the above applies to the data returned by the [`Config`](config-files)
and [`Library`](library-modules) modules when loading Javascript files. By
default they will return an object containing all exported values from the
Javascript file. If you want to access the `default` export, for example,
then you can add a `#default` suffix to the file basename when loading it.

```js{2}
libraryDir
  .library('Example#default')
  .then(
    default => {
      // do something with the default export here
    }
  )
```

Any other named export can be accessed in the same way.

```js{2}
libraryDir
  .library('Example#anotherExport')
  .then(
    anotherExport => {
      // do something with anotherExport here
    }
  )
```

## Navigating Your Own Data

You can use the `dataPath()` function to navigate your own data.

```js
import { dataPath } from '@abw/badger'

const animals = {
  aardvark: {
    name: "Alan"
  }
  badger: {
    name: "Brian"
  },
  cat: {
    name: "Colin"
  }
}

const badgerName = dataPath(data, 'badger/name');
```