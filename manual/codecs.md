# Data Codecs

Codecs are used to encode and decode data to and from serialised text.
The badger toolkit comes with two built-in codecs for `json` and `yaml` files.

**NOTE**: The codec utilities have been moved out to a separate
[badger-codecs](https://www.npmjs.com/package/@abw/badger-codecs)
module.

- [Read Data File](#read-data-files)
- [Write Data Files](#write-data-files)

## Read Data Files

Suppose that you have a `badger.yaml` file that you want to read.

```yaml
name:   Brian
animal: Badger
```

All you have to do is add the `{ codec: 'yaml' }`
option to the `file()` function.  The `read()`
method will then automatically decode the YAML text.

```js
import { file } from '@abw/badger'

file('badger.yaml', { codec: 'yaml' })
  .read()
  .then(
    data => console.log(data.name, 'is a', data.animal)
  )
```

This prints the string "Brian is a Badger" to the console.

You can also do the same thing using the `file()` method on a directory
object.

```js
import { dir } from '@abw/badger'

dir('data')
  .file('badger.yaml', { codec: 'yaml' })
  .read()
  .then(
    data => console.log(data.name, 'is a', data.animal)
  )
```

## Write Data Files

The `codec` option also works when writing data.

```js
import { file } from '@abw/badger'

file('giraffe.yaml', { codec: 'yaml' })
  .write({
    name:   "Gerald",
    animal: "Giraffe",
  })
```

You should now have a `giraffe.yaml` file containing the following:

```yaml
name: Gerald
animal: Giraffe
```

