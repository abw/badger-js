import test from 'ava';
import path from 'path';
import { bin, workspace } from '../../src/Badger.js'

const thisDir = bin(import.meta.url);
const testDir = thisDir.dir('test_space');

const testSpace = workspace({ dir: testDir });

