import test from 'ava';
import { workspace } from '../../src/Badger.js'
import { bin } from '@abw/badger-filesystem'

const testDir = bin(import.meta.url).dir('test_space');

test(
  'fetch config/animal',
  async t => {
    const space = workspace(testDir);
    const animal = await space.config('animal');
    t.is( animal.name, 'Bobby' );
    t.is( animal.animal, 'Badger' );
  }
);

test(
  'fetch config/animals',
  async t => {
    const space = workspace(
      testDir,
      {
        config: { dir: 'config2'}
      }
    );
    const animals = await space.config('animals');
    t.is( animals[0].name, 'Bobby' );
    t.is( animals[0].animal, 'Badger' );
    t.is( animals[1].name, 'Frankie' );
    t.is( animals[1].animal, 'Ferret' );
  }
);

test(
  'fetch both',
  async t => {
    const space = workspace(
      testDir,
      {
        config: {
          dir: ['config', 'config2']
        }
      }
    );
    const animal = await space.config('animal');
    t.is( animal.name, 'Bobby' );
    t.is( animal.animal, 'Badger' );

    const animals = await space.config('animals');
    t.is( animals[0].name, 'Bobby' );
    t.is( animals[0].animal, 'Badger' );
    t.is( animals[1].name, 'Frankie' );
    t.is( animals[1].animal, 'Ferret' );
  }
);

test(
  'fetch both with directory objects',
  async t => {
    const space = workspace(
      testDir,
      {
        config: {
          dir: [testDir.dir('config'), testDir.dir('config2')]
        }
      }
    );
    const animal = await space.config('animal');
    t.is( animal.name, 'Bobby' );
    t.is( animal.animal, 'Badger' );

    const animals = await space.config('animals');
    t.is( animals[0].name, 'Bobby' );
    t.is( animals[0].animal, 'Badger' );
    t.is( animals[1].name, 'Frankie' );
    t.is( animals[1].animal, 'Ferret' );
  }
);

test(
  'fetch both with absolute paths',
  async t => {
    const space = workspace(
      testDir,
      {
        config: {
          dir: [testDir.dir('config').path(), testDir.dir('config2').path()]
        }
      }
    );
    const animal = await space.config('animal');
    t.is( animal.name, 'Bobby' );
    t.is( animal.animal, 'Badger' );

    const animals = await space.config('animals');
    t.is( animals[0].name, 'Bobby' );
    t.is( animals[0].animal, 'Badger' );
    t.is( animals[1].name, 'Frankie' );
    t.is( animals[1].animal, 'Ferret' );
  }
);