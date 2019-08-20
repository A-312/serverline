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

## Functionality :

- Readline always available ;
- Commands history ;
- Autocompletition ;
- No split between input & output ;
- Password mode to hide input (try 'pwd' command), [more effect here](https://stackoverflow.com/a/24037546/2226755) ;
- You can eval command or javascript function like browser.

[![gif example][1]][1]

  [1]: https://i.stack.imgur.com/Xi24D.gif

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
    case 'help'
      console.log('help: To get this message.')
      break
    case 'pwd'
      console.log('toggle muted', !myRL.isMuted())
      myRL.setMuted(!myRL.isMuted(), '> [hidden]')
      return true
    case 'help'
      return myRL.secret('secret:', function() {
        console.log(')')
      })
  }

  if (myRL.isMuted())
    myRL.setMuted(false)
})

myRL.on('SIGINT', function(rl) {
  rl.question('Confirm exit: ', (answer) => answer.match(/^y(es)?$/i) ? process.exit(0) : rl.output.write('\x1B[1K> ')
})

function main() {
  let i = 0
  setInterval(function() {
    const num = () => Math.floor(Math.random() * 255) + 1
    i++
    console.log(i + ' ' + num() + '.' + num() + '.' + num() + ' user connected.')
  }, 700)
}

main()
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

## API

### Serverline.init(strPrompt)

  - `strPrompt` (`String`, default: `'> '`): Sets the prompt that will be written to output

Start serverline's readline.

```js
const myRL = require('serverline')

myRL.init()
```


### Serverline.secret(query, callback)

 - `query` `String`: A statement or query to write to output, prepended to the prompt.
 - `callback` `Function`: A callback function that is invoked with the user's input in response to the query.

Display the query by writing it to the output, waits for user input to be provided on input and press `ENTER`, then invokes the callback function passing the provided input as the first argument.

```js
myRL.init()

myRL.secret('secret:', function() {
  console.log(';)')
})
// output :
// secret:[-=]
```


### Serverline.getPrompt()

  - Returns `String`: Gets the current prompt that is wrote to output


### Serverline.setPrompt(strPrompt)

  - `strPrompt` `String`: Sets the prompt that will be written to output


### Serverline.isMuted()

  - Returns `Boolean`: True if the input is hidden


### setMuted(enabled, strPrompt)

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


### Serverline.getRL()

   - Returns: The [readline instance](https://nodejs.org/api/readline.html#readline_readline)

You can get more event with : `myRL.getRL().on(...)` but we recommand to use `myRL.on(...)`


### Serverline.getHistory()

   - Returns `Array[String]`: List of commands

Get History.


### Serverline.getHistory()

   - Returns `Array[String]`: List of commands

Rewrite history.


### Serverline.close()

Close the `readline.Interface` instance and relinquishe control over the `input` and `output` streams. When called, the `'close'` event will be emitted.

Calling `rl.close()` does not immediately stop other events (including `'line'`) from being emitted.

[Node doc](https://nodejs.org/api/readline.html#readline_rl_close)


### Serverline.pause()

Pause the `input` stream, allowing it to be resumed later if necessary.

Calling `.pause()` does not immediately pause other events (including `'line'`) from being emitted.

[Node doc](https://nodejs.org/api/readline.html#readline_rl_pause)

  pause: function() {
    rl.pause()
  },
    close: function() {
      rl.close()
    }
  }


### Serverline.on(eventName)

  - `eventName` (`String` \| `Symbol`): The name of the event
  - `listener` `Function`: The callback function

Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times. [Read more](https://nodejs.org/api/events.html#events_emitter_on_eventname_listener)


#### Event: 'line'

The `'line'` event is emitted whenever the input stream receives an end-of-line input (`\n`, `\r`, or `\r\n`). This usually occurs when the user presses the `<Enter>`, or `<Return>` keys.

The listener function is called with a string containing the single line of received input.

```js
myRL.init()

myRL.setPrompt('> ')

myRL.on('line', function(line) {
  console.log('cmd:', line)
  if (line == 'help') {
    console.log('help: To get this message.')
  }
})
```


#### Event: 'line'

The `'line'` event is emitted whenever the input stream receives an end-of-line input (`\n`, `\r`, or `\r\n`). This usually occurs when the user presses the `<Enter>`, or `<Return>` keys.

The listener function is called with a string containing the single line of received input.

```js
myRL.init()

myRL.setPrompt('> ')

myRL.on('line', function(line) {
  console.log('cmd:', line)
  if (line == 'help') {
    console.log('help: To get this message.')
  }
})
```

#### Event: 'close'

The `'close'` event is emitted when one of the following occur:

 - The `rl.close()` method is called and the `readline.Interface` instance has relinquished control over the `input` and `output` streams;
 - The input stream receives its `'end'` event;
 - The input stream receives `<ctrl>-D` to signal end-of-transmission (EOT);
 - The input stream receives `<ctrl>-C` to signal `SIGINT` and there is no `'SIGINT'` event listener registered on the `readline.Interface` instance.

The listener function is called without passing any arguments.

The `readline.Interface` instance is finished once the `'close'` event is emitted.

[Node doc](https://nodejs.org/api/readline.html#readline_event_close)


#### Event: 'SIGINT'

The `'SIGINT'` event is emitted whenever the `input` stream receives a `<ctrl>-C` input, known typically as `SIGINT`. If there are no `'SIGINT'` event listeners registered when the input stream receives a `SIGINT`, the `'pause'` event will be emitted.

The listener function is invoked without passing any arguments.

```js
myRL.on('SIGINT', function(rl) {
  rl.question('Confirm exit: ', function(answer) {
    return (answer.match(/^o(ui)?$/i) || answer.match(/^y(es)?$/i)) ? process.exit(0) : rl.output.write('\x1B[1K> ')
  })
})
```

[Node doc](https://nodejs.org/api/readline.html#readline_event_sigint)


#### Event: 'completer'

 - arg (Object = { line, hits})
    - line `String`: current line
    - hits `Array[String]`: all completion will be displayed

You can make a better completer with dynamic values :

```js
myRL.init()

myRL.setPrompt('> ')

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
