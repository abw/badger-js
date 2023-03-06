import process from 'node:process'
import { brightGreen, brightRed } from './Color.js';

export const appStatus = app => async function(...args) {
  try {
    const message = await app(...args);
    if (message) {
      console.log(brightGreen(`✓ ${message}`));
    }
  }
  catch (error) {
    console.log(
      process.env.DEBUG
        ? error
        : brightRed(`✗ ${error.message||error}`)
    )
  }
}

export default appStatus