#!/usr/bin/env node
import chokidar from 'chokidar'
import process from 'node:process'
import kidproc from 'node:child_process'
import { file } from '@abw/badger-filesystem'
import { debounce, doNothing, sleep } from '@abw/badger-utils'
import { quit, abort, exit } from './Exit.js'
import { cmdLineFlags } from './CmdLine.js'
import { palette } from './Color.js'

export const defaults = {
  script: process.argv[1].split('/').at(-1),
  prefix: 'watcher >',
  colors: {
    prefix:   'dark grey',
    error:    'bright red',
    watcher:  'bright yellow',
    section:  'bright white',
    program:  'bright green',
    arg:      'bright cyan',
    args:     'bright blue',
    debug:    'bright grey',
    command:  'yellow',
    scanning: 'cyan',
    watching: 'cyan',
    change:   'bright cyan',
    starting: 'bright green',
    stopping: 'bright red',
    stopped:  'green',
    failed:   'bright red',
  }
};

export async function watch(options) {
  const { config, cmdLine } = watcherFunctions(options)
  const cmdOptions = await cmdLine()
  const { watch, restart, program, programArgs } = cmdOptions
  const {
    scanning, watching, starting, stopping, failed, stopped, change
  } = watcherStatus({ ...config, ...cmdOptions })

  let child
  let ready = false

  scanning()
  watching(watch)

  const start = () => {
    if (child) {
      return
    }
    starting()
    child = kidproc.spawn(
      program,
      programArgs,
      {
        stdio: 'inherit',
      }
    )
    child.on(
      'exit',
      (code, signal) => {
        if (signal) {
          return
        }
        if (code) {
          failed(code)
        }
        else {
          stopped()
        }
        if (restart) {
          child = null
          sleep(500).then(start)
        }
        else {
          exit(code)
        }
      }
    )
  }

  const stop = () => {
    if (child) {
      return
    }
    stopping()
    child.kill()
    child = null
  }

  const changed = debounce(
    () => {
      stop()
      start()
    },
    300
  )

  chokidar.watch(
    watch
  ).on(
    'ready',
    () => {
      start()
      ready = true
    }
  ).on(
    'all',
    (event, path) => {
      if (ready) {
        change(event, path)
        changed()
      }
    }
  )
}

export const watcherFunctions = (props) => {
  const config = { ...defaults, ...props };
  const colors = config.colors = palette({
    ...defaults.colors,
    ...config.colors
  })

  const helpText = watcherHelpText(config)

  const help = () => quit(
    helpText()
  )

  const barf = error => abort(
    helpText(error)
  )

  const cmdLine = async () => {
    const { flags, args } = cmdLineFlags(
      {
        options: 'watch restart verbose help',
        short: {
          w: 'watch',
          r: 'restart',
          v: 'verbose',
          h: 'help',
        },
        on: {
          help,
          watch: (name, arg, args, flags) => {
            flags.watch ||= [ ]
            if (! args.length) {
              barf(`The -w option expects an argument!`)
            }
            flags.watch.push(args.shift())
            return true
          }
        }
      }
    )
    const [ program, ...programArgs ] = args
    const progText = args.join(' ')

    if (args.length < 1) {
      barf('No program specified to run!')
    }
    if (! flags.watch?.length) {
      barf('Nothing specified to watch!')
    }
    if (! await file(program).exists()) {
      barf(`Program not found: ${program}`)
    }

    return  {
      ...flags, progText, program, programArgs
    }
  }

  return { config, colors, helpText, help, barf, cmdLine }
}

export const watcherStatus = ({ verbose, colors, prefix, progText }) => {
  const scanning = () => verbose
    ? console.log(
      colors.prefix(prefix),
      colors.scanning('scanning...')
    )
    : doNothing

  const watching = paths => verbose
    ? paths.forEach(
      path => console.log(
        colors.prefix(prefix),
        colors.watching('watching '),
        colors.command(path)
      )
    )
    : doNothing

  const change = (event, path) => verbose
    ? console.log(
      colors.prefix(prefix),
      colors.change(`${event}`.padEnd(9)),
      colors.command(path)
    )
    : doNothing

  const starting = () => verbose
    ? console.log(
      colors.prefix(prefix),
      colors.starting('starting '),
      colors.command(progText)
    )
    : doNothing

  const stopping = () => verbose
    ? console.log(
      colors.prefix(prefix),
      colors.stopping('stopping '),
      colors.command(progText)
    )
    : doNothing

  const failed = code => verbose
    ? console.log(
      colors.prefix(prefix),
      colors.failed(`failed ${code}`),
      colors.command(progText)
    )
    : doNothing

  const stopped = () => verbose
    ? console.log(
      colors.prefix(prefix),
      colors.stopped(`stopped  `),
      colors.command(progText)
    )
    : doNothing

  return {
    scanning, watching, change, starting,
    stopping, failed, stopped
  }

}

export const watcherHelpText = ({ colors, script }) => {
  const { watcher, arg, section, program, args, error } = colors
  const name = watcher(script)
  return errMsg => `${name}
${errMsg ? `\n${error(errMsg)}\n` : ''}
${section('Usage')}

  $ ${name} [${arg('options')}] ${program('program')} [${args('arg1 arg2 ...')}]

${section('Description')}

  This program will run another program and restart it if any files
  are added, deleted or modified in one or more watched locations.

  Paths to watch should be specified using the ${arg('-w')} (or ${arg('--watch')})
  option.  You can specify this multiple times for different paths.

  The path to the ${program('program')} should follow, along with any additional
  ${args('arguments')} to be passed to it.

  If the ${arg('-r')} (or ${arg('--restart')}) option is specified then the
  program will be restarted when it exits.

${section('Options')}

  ${arg('-w <path>')} / ${arg('--watch <path>')}   Watch a path for changes
  ${arg('-r')}        / ${arg('--restart')}        Restart program on exit
  ${arg('-v')}        / ${arg('--verbose')}        Verbose mode
  ${arg('-h')}        / ${arg('--help')}           This help

${section('Examples')}

  $ ${name} ${arg('-w .')} ${program('bin/foo.js')}
  $ ${name} ${arg('-w lib -w config')} ${program('bin/foo.js')}
  $ ${name} ${arg('-w lib -w config')} ${program('bin/foo.js')} ${args('bar baz')}
  $ ${name} ${arg('-w lib -w config -v')} ${program('bin/foo.js')} ${args('bar baz')}
  $ ${name} ${arg('-w lib -w config -v -r')} ${program('bin/foo.js')} ${args('bar baz')}
`
}
