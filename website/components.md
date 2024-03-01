# Components

One of the problems faced in any non-trivial project is how to manage
complexity.  There are often many different parts of the system that
are inter-dependent but should be as independent from each other as
possible.

Component based programming is one way to tackle this problem.  It's
like modules on steroids.  The [`Workspace`](workspace) module has a
[`component()`](workspace#component) that allows you to load components.
In this example we'll look at writing your own components.

## Creating a Component

The `Component` class defines a very simple base class that you can use
for your own components.  For a simple example, let's create a component
that prints a cheerful message.  We'll save this in our project as
`lib/Greeting.js`.

```js
import { Component } from '@abw/badger'

class Greeting extends Component {
  hello() {
    console.log('Hello World!')
  }
}

export default Component
```

Now we can create a [`Workspace`](workspace) object, load the component
and call the `hello()` method.

Let's assume this script is saved as `bin/hello.js`.  We want to create a
workspace for the parent directory, so we use `bin().parent()` to determine
that.

```js
#!/usr/bin/env node
import { bin, workspace } from '@abw/badger'

// create a workspace based on the parent directory
const myspace = workspace(
  bin().parent()
)

// load the "Greeting" component
const greeting = await myspace.component('Greeting')

// call the hello() method
greeting.hello()        // 'Hello World!'
```

One of the benefits of this approach is that we can create a configuration
file for this component and it will be loaded automatically.

For example, we can create a `config/Greeting.yaml` file which looks like
this:

```yaml
message: Hello Badger Fans!
```

You can define an `initComponent()` method in your component.  This will be
passed the configuration options as an argument.  We can save the `message`
from the configuration file in `this.message` and then output that in the
`hello()` method.

```js{4-6,8}
import { Component } from '@abw/badger'

class Greeting extends Component {
  initComponent(config) {
    this.message = config.message ?? 'Hello World!'
  }
  hello() {
    console.log(this.message)
  }
}

export default Component
```

Now when we call the `hello()` method we get the custom message displayed.

```js
// call the hello() method
greeting.hello()        // 'Hello Badger Fans!'
```

You can override the configuration options by passing a second argument to
the workspace `component()` method.

```js
// load the "Greeting" component with custom configuration
const greeting = await myspace.component(
  'Greeting',
  { message: 'Have a nice day!' }
)

// call the hello() method
greeting.hello()        // 'Have a nice day'
```

Each component has a `this.workspace` property which is a reference to the
[`Workspace`](workspace) object that created it.  Through this you can access
any workspace methods.  For example, to load other components, read and write
files, load configuration files, and so on.

This allows your components to remain more independent of other components.
Instead of instantiating and configuring them directly they can ask the
workspace to do it for them.

Component A doesn't need to know anything about how Component B is configured,
or even where is it located.  It's up to the workspace to take responsibility
for that.

This is a variation of the "Law of Demeter", also known as "the principle of least
knowledge".  It's generally considered a Good Thing™️.