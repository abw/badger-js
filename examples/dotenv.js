#!/usr/bin/env node
import { dotenv } from '../src/Badger.js';
import process from 'node:process'

const env = await dotenv({
  addToProcessEnv: false,
  debug: true
})

console.log(`env: `, env);

console.log(`MESSAGE: `, env.MESSAGE)
console.log(`NAME: `, env.NAME)

console.log(`process.env.MESSAGE: `, process.env.MESSAGE)
console.log(`process.env.NAME: `, process.env.NAME)

