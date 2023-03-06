import process from 'node:process'

export function exit(value, message) {
  if (message) {
    console.log(message);
  }
  process.exit(value);
}

export function quit(message) {
  exit(0, message);
}

export function abort(message) {
  exit(1, message);
}