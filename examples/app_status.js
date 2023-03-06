#!/usr/bin/env node
import { prompt, appStatus } from '../src/Badger.js';

const app = appStatus(
  async () => {
    const n = await prompt('Enter an even number');
    if (n % 2) {
      throw `${n} is not an even number`
    }
    return `You entered ${n}`;
  }
)

app();