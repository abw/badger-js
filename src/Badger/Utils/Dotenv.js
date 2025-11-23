// dotenv is still in the dark ages of using require() which causes problems
// when you're in an ESM only environment.  This is a modern async replacement
// which is ESM-only and has some additional features:
//   * looks for the .env file in the directory in which the script is defined
//   * looks for the .env file in the current working directory
//   * walks up through parents of those directories to find it
//   * returns the loaded environment variables as an object
//   * adding to process.env van be disabled
//

import { bin, cwd, dir, file } from '@abw/badger-filesystem'
import { fail } from '@abw/badger-utils'
import process from 'node:process'

const DOT_ENV = '.env'
const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg

export async function findDotenv({
  filename = DOT_ENV,
  dirs = [ bin(), cwd() ],
  walkup = true
}) {
  const lookedIn = { }
  const search = dirs.map(
    d => dir(d)
  )

  while (search.length) {
    const d = search.shift()

    if (! lookedIn[d.path()]) {
      lookedIn[d.path()] = true
      const dotEnv = d.file(filename)
      const exists = await dotEnv.exists()
      if (exists) {
        return dotEnv.path()
      }
      if (walkup) {
        search.push(d.up())
      }
    }
  }
  fail(`Cannot locate ${DOT_ENV} file in any parent directory of ${dirs.join(', ')}`)
}

export function parseDotenv(text) {
  const env = { }

  // Convert buffer to string and standardise line endings
  const lines = text.toString().replace(/\r\n?/mg, '\n')
  let match

  while ((match = LINE.exec(lines)) != null) {
    const key = match[1]

    // Default undefined or null to empty string
    let value = (match[2] ?? '')
    value = value.trim()

    // Check if double quoted
    const maybeQuote = value[0]

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2')

    // Expand newlines if double quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, '\n')
      value = value.replace(/\\r/g, '\r')
    }

    // Add to object
    env[key] = value
  }

  return env
}

/**
 * Modern ESM and async version of the dotenv module.  Looks for a .env
 * file in the source directory of the running script and/or the current
 * working directory, or the closest parent directory of either of those
 * that contains one.
 * @async
 * @function dotenv
 * @param {Object}  [options] - configuration options
 * @param {String}  [options.path] - explicit path to .env file
 * @param {String}  [options.filename] - alternate name for .env file
 * @param {Array}   [options.dirs] - array of directories to search in (default: bin() and cwd())
 * @param {Boolean} [options.walkup] - walkup from search directories to parent directories (default: true)
 * @param {Boolean} [options.addToProcessEnv] - add environment to process.env (default: true)
 * @param {Boolean} [options.debug] - enable debugging messages
 * @return {Object} the loaded environment variables
 * @example
 * dotenv()
 * @example
 * dotenv({ path: '/path/to/my/.env' })
 * @example
 * dotenv({ filename: '.env-local' })
 * @example
 * dotenv({ dirs: ['/dir/one', '/dir/two'] })
 * @example
 * dotenv({ dirs: ['/dir/one', '/dir/two'], walkup: false })
 * @example
 * const env = dotenv({ addToProcessEnv: false })
 */
export async function dotenv({
  path,
  filename,
  dirs,
  addToProcessEnv=true,
  debug=false
} = { }) {
  path ||= await findDotenv({ filename, dirs })
  if (debug) {
    console.log(`Loading environment from ${path}`)
  }
  const f = file(path)
  if (! await f.exists()) {
    fail(`Specified environment file does not exist: ${path}`)
  }
  const text = await f.read()
  const env = parseDotenv(text)

  if (debug) {
    console.log(`Loaded environment:`, env)
  }

  if (addToProcessEnv) {
    Object.assign(process.env, env)
    if (debug) {
      console.log(`Added environment to process.env`)
    }
  }

  return env
}

