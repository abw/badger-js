#!/usr/bin/env node
import { cmdLineArg } from '../src/Badger/Utils/CmdLine.js'
import { sleep } from '@abw/badger-utils'

const a = await cmdLineArg()
const n = a ? parseInt(a) : 10

for (let i = 1; i <= n; i++) {
  console.log(i)
  await sleep(1000)
}
