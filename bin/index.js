/*
 * Tested on: node v10
 */

if (process.version.match(/v(\d+)\.(\d+).(\d+)/)[1] < 10) {
  throw new Error('serverline require node >= 10')
}

const EventEmitter = require('events')
const readline = require('readline')
const stream = require('stream')
const util = require('util')

const myEmitter = new EventEmitter()

let rl = null
let stdoutMuted = false
let myPrompt = '> '
let completions = []

const collection = {
  stdout: new stream.Writable(),
  stderr: new stream.Writable()
}

function Serverline() {
  return {
    init: init,
    secret: secret,
    getPrompt: function() {
      return myPrompt
    },
    isMuted: function() {
      return stdoutMuted
    },
    setCompletion: function(obj) {
      completions = (typeof obj === 'object') ? obj : completions
    },
    setMuted: function(enabled, msg) {
      stdoutMuted = !!enabled

      const message = (msg && typeof msg === 'string') ? msg : '> [hidden]'
      rl.setPrompt((!stdoutMuted) ? myPrompt : message)
      return stdoutMuted
    },
    setPrompt: function(strPrompt) {
      myPrompt = strPrompt
      rl.setPrompt(myPrompt)
    },
    on: function(eventName) {
      switch (eventName) {
        case 'line':
        case 'SIGINT':
        case 'completer':
          return myEmitter.on.apply(myEmitter, arguments)
      }

      rl.on.apply(myEmitter, arguments)
    },
    getRL: function() {
      return rl
    },
    getHistory: function() {
      return rl.history
    },
    setHistory: function(history) {
      rl.history = history
    },
    pause: function() {
      rl.pause()
    },
    resume: function() {
      rl.pause()
    },
    close: function() {
      rl.close()
    },
    _debugModuleSupport: function(debug) {
      debug.log = function log() {
        console.log(util.format.apply(util, arguments).toString())
      }
    }
  }
}

module.exports = new Serverline()

let fixSIGINTonQuestion = false

function beforeTheLastLine(chunk) {
  const nbline = Math.ceil((rl.line.length + 3) / rl.columns)

  let text = ''
  text += '\n\r\x1B[' + nbline + 'A\x1B[0J'
  text += chunk.toString() + '\r'
  text += Array(nbline).join('\r\x1B[1E')

  return Buffer.from(text, 'utf8')
}

function init(strPrompt) {
  myPrompt = strPrompt || '> '

  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: completer
  })

  consoleOverwrite()
  hiddenOverwrite()

  rl.setPrompt(myPrompt)
  rl.on('line', function(line) {
    if (!stdoutMuted) {
      rl.history.push(line)
    }
    myEmitter.emit('line', line)
    rl.prompt()
  })
  rl.on('SIGINT', function() {
    fixSIGINTonQuestion = !!rl._questionCallback
    rl.line = ''
    if (!myEmitter.emit('SIGINT', rl)) {
      process.exit(0)
    }
  })
  rl.prompt()


  rl.input.on('data', function(char) { // fix CTRL+C on question
    if (char === '\u0003' && fixSIGINTonQuestion) {
      rl._onLine('')
      rl._refreshLine()
    }
    fixSIGINTonQuestion = false
  })
}

function secret(query, callback) {
  const toggleAfterAnswer = !stdoutMuted
  stdoutMuted = true
  rl.question(query, function(value) {
    rl.history = rl.history.slice(1)

    if (toggleAfterAnswer) {
      stdoutMuted = false
    }

    callback(value)
  })
}

function hiddenOverwrite() {
  rl._refreshLine = (function(refresh) {
    // https://github.com/nodejs/node/blob/v9.5.0/lib/readline.js#L335
    return function _refreshLine() {
      let abc
      if (stdoutMuted) {
        abc = rl.line
        rl.line = ''
      }

      refresh.call(rl)

      if (stdoutMuted) {
        rl.line = abc
      }
    }
  })(rl._refreshLine)

  rl._writeToOutput = (function(write) {
    // https://github.com/nodejs/node/blob/v9.5.0/lib/readline.js#L442
    return function _writeToOutput(argStringToWrite) {
      let stringToWrite = argStringToWrite

      if (stdoutMuted) {
        stringToWrite = '\x1B[2K\x1B[200D' + rl._prompt + '[' + ((rl.line.length % 2 === 1) ? '=-' : '-=') + ']'
      }

      write.call(rl, stringToWrite)
    }
  })(rl._writeToOutput)
}

function consoleOverwrite() {
  const original = {
    stdout: process.stdout,
    stderr: process.stderr
  }

  Object.keys(collection).forEach((name) => {
    collection[name]._write = function(chunk, encoding, callback) {
      original[name].write(beforeTheLastLine(chunk), encoding, () => {
        rl._refreshLine()
        callback()
      })
    }
  })

  const Console = console.Console
  console = new Console(collection.stdout, collection.stderr) // eslint-disable-line no-global-assign
  console.Console = Console
}

function completer(line) {
  let hits = completions.filter(function(c) {
    return c.indexOf(line) === 0
  })

  const arg = {
    line: line,
    hits: hits
  }

  myEmitter.emit('completer', arg)

  hits = arg.hits
  if (hits.length === 1) {
    return [hits, line]
  } else {
    console.log('\x1B[96mSuggest:\x1B[00m')

    let list = ''
    let l = 0
    let c = ''
    let t = hits.length ? hits : completions

    for (let i = 0; i < t.length; i++) {
      c = t[i].replace(/(\s*)$/g, '')

      if (list !== '') {
        list += ', '
      }

      if (((list + c).length + 4 - l) > process.stdout.columns) {
        list += '\n'
        l = list.length
      }
      list += c
    }
    console.log('\x1B[96m' + list + '\x1B[00m')
    return [(line !== arg.line) ? [arg.line] : [], line]
  }
}
