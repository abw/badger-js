import test from 'ava';
import { bin, workspace } from '../../src/Badger.js'
import { snakeToStudly } from '@abw/badger-utils'

const DEBUG = false;
const testDir = bin(import.meta.url).dir('test_space');
const testSpace = workspace(
  testDir,
  {
    debug: DEBUG,
    debugPrefix: '    workspace > ',
    debugColor: 'blue',
    config: {
      debug: DEBUG,
      debugPrefix: '    config > ',
      debugColor: 'green'
    },
    library: {
      debug: DEBUG,
      debugPrefix: '    library > ',
      debugColor: 'yellow'
    },
    case: {
      library: snakeToStudly
    }
  }
);

test(
  'fetch component1',
  async t => {
    const comp1 = await testSpace.component('Component1');
    t.is( comp1.message(), 'Hello World!' );
    t.is( comp1.props.animal, 'Badger' );
  }
);
test(
  'fetch component1 with custom config',
  async t => {
    const comp1 = await testSpace.component('Component1', { animal: 'Ferret' });
    t.is( comp1.message(), 'Hello World!' );
    t.is( comp1.props.animal, 'Ferret' );
  }
);
test(
  'fetch component2',
  async t => {
    const comp2 = await testSpace.component('Component2');
    t.is( await comp2.message(), 'K Thx Bye!' );
  }
);
test(
  'fetch component1 which fetches component2',
  async t => {
    const comp1 = await testSpace.component('Component1');
    t.is( await comp1.messages(), 'Hello World!, K Thx Bye!' );
  }
);

test(
  'fetch component3 which has a custom component library and export',
  async t => {
    const comp3 = await testSpace.component('Component3');
    t.is( await comp3.message(), 'Component 3 message: Three is the magic number' );
  }
);

test(
  'fetch component4 which has a custom component library and export',
  async t => {
    const comp4 = await testSpace.component('Component4');
    t.is( await comp4.message(), 'Component 4 message: Four is the magic number' );
  }
);

test(
  'fetch component4 but override import',
  async t => {
    const comp4 = await testSpace.component('Component4#MyComponent3');
    t.is( await comp4.message(), 'Component 3 message: Four is the magic number' );
  }
);

test(
  'fetch my/test',
  async t => {
    const test = await testSpace.component('my/test');
    t.is( await test.message(), 'Hello World!' );
  }
);

test(
  'fetch hello component',
  async t => {
    const hello = await testSpace.component('Hello');
    t.is( await hello.message(), 'Hello World!' );
  }
);

test(
  'fetch hello component the long way',
  t =>
    testSpace.config('Hello').then(
      config => testSpace.library('Hello')
        .then( library => new library.default(testSpace, config) )
        .then( hello => t.is( hello.message(), 'Hello World!' ) )
    )
);
