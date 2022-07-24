# Data Codecs

Codecs are used to encode and decode data to and from serialised text.
The badger toolkit comes with two built-in codecs for `json` and `yaml` files.

- [Read Data File](#read-data-files)
- [Write Data Files](#write-data-files)

## Read Data Files

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

## Write Data Files

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

