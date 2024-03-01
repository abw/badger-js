---
outline: deep
---
# Quitting

There are three similar, but slightly different, functions provided for
when you want to exit a script.

## exit()

The `exit()` function exits the current
process.  It is a trivial wrapper around `process.exit()`.

The first argument is an exit code (0 for a sucessful exit,
any other value to indicate an exceptional condition).  The second
optional argument can be a message to display before exiting.

```js
import { exit } from '@abw/badger'

exit(0, 'Goodbye')
```

## quit()

The `quit()` function is a wrapper around
the [`exit()`](#exit) function that sets the exit code
to 0 to indicate successful termination.

```js
import { quit } from '@abw/badger'

quit('Goodbye')
```

## abort()

The `abort()` function is a wrapper around
the [`exit()`](#exit) function that sets the exit
code to 1 to indicate an error condition.

```js
import { abort } from '@abw/badger'

abort('Big plate of failed')
```

