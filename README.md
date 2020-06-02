# serverline

  [![NPM Version][npm-image]][npm-url]
  [![Node Version][node-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Linux Build][travis-image]][travis-url]

Better prompt interface when a new line is added when input is active

[node-image]: https://img.shields.io/node/v/serverline
[npm-image]: https://img.shields.io/npm/v/serverline.svg
[npm-url]: https://npmjs.org/package/serverline
[downloads-image]: https://img.shields.io/npm/dm/serverline.svg
[downloads-url]: https://npmjs.org/package/serverline
[travis-image]: https://img.shields.io/travis/com/A-312/serverline/master.svg?label=linux
[travis-url]: https://travis-ci.com/A-312/serverline

## Features :

- Readline always available ;
- Support for [debug](https://www.npmjs.com/package/debug) module with `myRL._debugModuleSupport(require('debug'))` ;
- Commands history ;
- Autocompletition ;
- No split between input & output ;
- Password mode to hide input (try 'pwd' command), [more effect here](https://stackoverflow.com/a/24037546/2226755) ;
- You can eval command or javascript function like browser.

### Screenshot :

[![demo with debug][1]][1]

  [1]: https://i.imgur.com/5AMGsb9.gif

#### See more :

 - [Demo with `console.log`](https://i.imgur.com/C7OQj5Y.gif)


## Quick start

Support Windows/Linux/(Mac?) and node >=10 (for oldest version see below)

### Install serverline

```
npm install serverline
```

### Example `/server/bin/index.js`:

```js
process.stdout.write('\x1Bc')

const myRL = require('serverline')

myRL.init()
myRL.setCompletion(['help', 'command1', 'command2', 'login', 'check', 'ping'])

myRL.setPrompt('> ')

myRL.on('line', function(line) {
  console.log('cmd:', line)
  switch (line) {
    case 'help':
      console.log('help: To get this message.')
      break
    case 'pwd':
      console.log('toggle muted', !myRL.isMuted())
      myRL.setMuted(!myRL.isMuted(), '> [hidden]')
      return true
    case 'secret':
      return myRL.secret('secret:', function() {
        console.log(';)')
      })
  }

  if (myRL.isMuted())
    myRL.setMuted(false)
})

myRL.on('SIGINT', function(rl) {
  rl.question('Confirm exit: ', (answer) => answer.match(/^y(es)?$/i) ? process.exit(0) : rl.output.write('\x1B[1K> '))
})

function displayFakeLog() {
  let i = 0
  setInterval(function() {
    const num = () => Math.floor(Math.random() * 255) + 1
    i++
    console.log(i + ' ' + num() + '.' + num() + '.' + num() + ' user connected.')
  }, 700)
}
displayFakeLog()
```

## Eval javascript command (like browser console) :

```js
myRL.on('line', function(line) {
  try {
    console.log(eval(line))
  } catch (e) {
    console.error(e)
  }
})
```

## Looking for old support ?

[See node > 9.5](https://stackoverflow.com/a/24519813/2226755) and [oldest version](https://stackoverflow.com/revisions/24519813/3)

## Support for external module

### debug

```js
process.env.DEBUG = '*'
const debug = require('debug')('server::info')

const myRL = require('serverline')

myRL.init()
myRL._debugModuleSupport(require('debug'))

myRL.setPrompt('> ')


function displayFakeLog() {
  let i = 0
  setInterval(function() {
    const num = () => Math.floor(Math.random() * 255) + 1
    i++
    debug(i + ' ' + num() + '.' + num() + '.' + num() + ' user connected.')
  }, 700)
}

displayFakeLog()
```

## API

### Serverline.init(options)

  - `options` (`Object` \| `String` if is String the value will be set to `options.prompt`):
      - `prompt` (`String`, default: `'> '`): Set the prompt that will be written to output.
      - `ignoreErrors` (`Boolean`, default: `true`): Ignore errors when writing to the underlying streams.
        By default `Console` instance is on silent mode, it will catch error without print anything (**in dev mode, set to `false`**). 
      - `colorMode` (`Boolean` \| `String`, default: `'auto'`): Set color support for the `Console` instance,
        enable color with `true` [Read more](console_new_console_options).
      - `inspectOptions` `Object`: Specifies options that are passed along to [util.inspect()](util_util_inspect_object_options).
      - `forceTerminalContext` (`Boolean`, default: `false`): Force node to use stdin like a real terminal.
        This setting is usefull if you redirect the output (with `npm start > file.txt`, `npm start | tee file.txt`, child_process, ...).

[console_new_console_options]: https://nodejs.org/api/console.html#console_new_console_options
[util_util_inspect_object_options]: https://nodejs.org/api/util.html#util_util_inspect_object_options

Start serverline's readline.

```js
const myRL = require('serverline')

myRL.init()
```


### Serverline.secret(query, callback)

 - `query` `String`: A statement or query to write to output, prepended to the prompt.
 - `callback` `Function`: A callback function that is invoked with the user's input in response to the query.

Display the query by writing it to the output, waits for user input to be provided on input and press `ENTER`, then invokes the callback function passing the provided input as the first argument.

The input will be hidden with `[-=]` and `[=-]`.

```js
myRL.init()

myRL.secret('secret:', function() {
  console.log(';)')
})
// output :
// secret:[-=]
```


### Serverline.question(query, callback)

 - `query` `String`: A statement or query to write to output, prepended to the prompt.
 - `callback` `Function`: A callback function that is invoked with the user's input in response to the query.

Display the query by writing it to the output, waits for user input to be provided on input and press `ENTER`, then invokes the callback function passing the provided input as the first argument.

[Node doc](https://nodejs.org/api/readline.html#readline_rl_question_query_callback)

```js
myRL.init()

myRL.question('What is your favorite food? ', (answer) => {
  console.log(`Oh, so your favorite food is ${answer}.`)
})
```


### Serverline.getPrompt()

  - Returns `String`: Gets the current prompt that is written to output


### Serverline.setPrompt(strPrompt)

  - `strPrompt` `String`: Sets the prompt that will be written to output


### Serverline.isMuted()

  - Returns `Boolean`: True if the input is hidden


### Serverline.setMuted(enabled, strPrompt)

  - `enabled` `Boolean`: Enable/Disable
  - `strPrompt` `String`: Sets the prompt that will be written to output

Enable hidden input:
```js
console.log('toggle muted', !myRL.isMuted())
myRL.setMuted(true, '> [hidden]')
// output :
// > [hidden][-=]
```

Disable hidden input:
```js
disable : myRL.setMuted(false)
```


### Serverline.setCompletion(obj)

  - `obj` `Array[String]`: Strings/commands displayed in autocompletion.

If you want use your own completion function use (see below an example): `myRL.on('completer', completerFunction)`.

Example:

```js
myRL.init()

myRL.setCompletion(['help', 'command1', 'command2', 'login', 'check', 'ping'])
```


### Serverline.getHistory()

   - Returns `Array[String]`: List of commands

Get History.


### Serverline.setHistory(history)

   - Returns `Array[String]`: List of commands

Rewrite history.


### Serverline.getCollection()

   - Returns: An Object with `stdout` and `stderr` used by serverline.

Use `Serverline.getCollection().stdout.write('msg\n')` can be usefull if you don't want to use `console.log('msg')`. `Serverline.getCollection().stdout` is different of `process.stdout`. Prefere to use `Serverline.getCollection().stdout.write('msg\n')` instead `process.stdout.write('msg\n')` because if you use `process.stdout.write`, you will get some prompt displays bugs.


### Serverline.getRL()

   - Returns: The [readline instance](https://nodejs.org/api/readline.html#readline_readline)

We recommand to use `Serverline.<function>()` function instead `Serverline.getRL().<function>()`.


### Serverline.close()

Close the `readline.Interface` instance and relinquishe control over the `input` and `output` streams. When called, the `'close'` event will be emitted.

Calling `rl.close()` does not immediately stop other events (including `'line'`) from being emitted.

[Node doc](https://nodejs.org/api/readline.html#readline_rl_close)


### Serverline.pause()

Pause the `input` stream, allowing it to be resumed later if necessary.

Calling `.pause()` does not immediately pause other events (including `'line'`) from being emitted.

[Node doc](https://nodejs.org/api/readline.html#readline_rl_pause)


### Serverline.resume()

Resume the input stream if it has been paused.

[Node doc](https://nodejs.org/api/readline.html#readline_rl_resume)


### Serverline.on(eventName, listener)

  - `eventName` (`String` \| `Symbol`): The name of the event
  - `listener` `Function`: The callback function

Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times. [Read more](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener)

**Serverline/Rewrited events :**
 - Event: 'line'
 - Event: 'SIGINT'
 - Event: 'completer'

**Navtive Readline events :**
 - Event: 'close'
 - Event: 'pause'
 - Event: 'resume'
 - Event: 'SIGCONT'
 - Event: 'SIGTSTP'

#### Event: 'line'

The `'line'` event is emitted whenever the input stream receives an end-of-line input (`\n`, `\r`, or `\r\n`). This usually occurs when the user presses the `<Enter>`, or `<Return>` keys.

The listener function is called with a string containing the single line of received input.

```js
myRL.init({
  prompt: '> '
})

myRL.on('line', function(line) {
  console.log('cmd:', line)
  if (line == 'help') {
    console.log('help: To get this message.')
  }
})
```


#### Event: 'SIGINT'

The `'SIGINT'` event is emitted whenever the `input` stream receives a `<ctrl>-C` input, known typically as `SIGINT`. If there are no `'SIGINT'` event listeners registered when the input stream receives a `SIGINT`, the `'pause'` event will be emitted.

The listener function is invoked without passing any arguments.

```js
myRL.on('SIGINT', function(rl) {
  rl.question('Confirm exit: ', (answer) => answer.match(/^y(es)?$/i) ? process.exit(0) : rl.output.write('\x1B[1K> '))
})
```

[Node doc](https://nodejs.org/api/readline.html#readline_event_sigint)


#### Event: 'completer'

 - arg (Object = { line, hits})
    - line `String`: current line
    - hits `Array[String]`: all completion will be displayed

You can make a better completer with dynamic values :

```js
process.stdout.write('\x1Bc')
const myRL = require('serverline')

myRL.init({
  prompt: '> '
})

myRL.setCompletion(['.backup', '.forceupdate', '.open', '.compare', '.rename', '.sandbox'])
myRL.on('completer', function(arg) {
    if (arg.hits.length == 1) {
        arg.line = arg.hits[0]
    }

    arg.hits = completerId('.backup ', arg.line, arg.hits)
    arg.hits = completerId('.forceupdate ', arg.line, arg.hits)
    arg.hits = completerId('.open ', arg.line, arg.hits)
    arg.hits = completerId('.compare ', arg.line, arg.hits)
    arg.hits = completerId('.rename ', arg.line, arg.hits)
    arg.hits = completerId('.sandbox ', arg.line, arg.hits)
})

const user_id = [1, 2, 3, 4]
function completerId(cmd, line, hits, verify) {
    var verify = (verify) ? verify : function(id, index) {
        return true
    }

    var t = [cmd]
    if (line.indexOf(cmd) == 0) {
        user_id.forEach(function(id, index) {
            if (!verify(id, index)) {
                return
            }
            t.push(cmd + id)
        })
        hits = t.filter(function(c) {
            return c.indexOf(line) == 0
        })
        if (hits.length == 0) {
            hits = t
        }
    }
    return hits
}
```

Output:

```
> .back
Suggestion:
.backup, .forceupdate, .open, .compare, .rename, .sandbox
> .backup
Suggestion:
.backup, .backup 1, .backup 2, .backup 3, .backup 4
```

#### Event: 'close'

[Node doc](https://nodejs.org/api/readline.html#readline_event_close)

```js
myRL.on('close', function(line) {
  console.log('bye')
})
```

#### Event: 'pause'

[Node doc](https://nodejs.org/api/readline.html#readline_event_pause)

```js
myRL.on('pause', function(line) {
  console.log('pause')
})
```

#### Event: 'resume'

[Node doc](https://nodejs.org/api/readline.html#readline_event_resume)

```js
myRL.on('resume', function(line) {
  console.log('resume')
})
```

#### Event: 'SIGCONT'

The `'SIGCONT'` event is not supported on Windows.

[Node doc](https://nodejs.org/api/readline.html#readline_event_SIGCONT)

#### Event: 'SIGTSTP'

The `'SIGTSTP'` event is not supported on Windows.

[Node doc](https://nodejs.org/api/readline.html#readline_event_SIGCONT)
