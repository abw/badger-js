import test from 'ava';
import { bin, workspace } from '../../src/Badger.js'

const DEBUG = false;
const testDir = bin(import.meta.url).dir('test_space');
const testSpace = workspace({
  dir: testDir,
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
  }
});

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
    t.is( await comp3.message(), 'Three is the magic number' );
  }
);
