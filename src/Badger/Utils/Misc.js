import process from "node:process"

/**
 * Returns an array of the `process.argv` array from offset 2 onwards,
 * i.e. removing the node path and script name.
 * @param {Array} argv - list of arguments, defaults to `process.argv`
 * @return {Array} array of arguments excluding the first two
 */
export function args(argv=process.argv) {
  return argv.slice(2);
}
