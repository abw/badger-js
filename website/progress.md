---
outline: deep
---
# Progress

If you're hanging around waiting for a long running process to finish then
it can be useful to have some kind of visual indication of the progress.

## progress()

The `progress()` function returns an object which can be used to give a visual
display of the progress of a long running process.  It is intended to be used
in cases where you know in advance how many actions you need to complete
(e.g. importing 1000 records into a database).

```js
import { progress } from '@abw/badger'

const records = [
  // lots of records
]
const p = progress(records.length);

for (record of records) {
  // do something with record
  p.printProgress();
}
```

The `printProgress()` method accepts an argument which is the number of
items you have processed in that loop (i.e. it's the delta, not the total
number processed so far).  It defaults to 1.

As the method is called it will print a few more "pixels" to the screen to
display a nice colourful image of an hourglass.

![Progress](/images/progress.png)

You can change the colours or use your own picture.  See the
[examples/progress.js](https://github.com/abw/badger-js/blob/master/examples/progress.js)
file for examples.

