# serverline

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Linux Build][travis-image]][travis-url]

Better prompt interface when a new line is added when input is active

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
- Password mode to hide input (try "pwd" command), [more effect here](https://stackoverflow.com/a/24037546/2226755) ;
- You can eval command or javascript function like browser.

[![gif example][1]][1]

  [1]: https://i.stack.imgur.com/Xi24D.gif

## Example :

### main.js :

```js    
process.stdout.write("\x1Bc");

const myRL = require("serverline");

myRL.init();
myRL.setCompletion(["help", "command1", "command2", "login", "check", "ping"]);

myRL.setPrompt("> ");

myRL.on("line", function(line) {
    console.log("cmd:", line);
    if (line == "help") {
        console.log("help: To get this message.");
    } else if (line == "pwd") {
        console.log("toggle muted", !myRL.isMuted());
        myRL.setMuted(!myRL.isMuted(), "> [hidden]");
        return true;
    } else if (line == "secret") {
        return myRL.secret("secret:", function() {
            console.log(";)");
        });
    }

    if (myRL.isMuted())
        myRL.setMuted(false);
});

myRL.on("close", function() {
	//something
});

myRL.on("SIGINT", function(rl) {
    rl.question("Confirm exit: ", function(answer) {
        return (answer.match(/^o(ui)?$/i) || answer.match(/^y(es)?$/i)) ? process.exit(1) : rl.output.write("\x1B[1K> ");
    });
});

function main() {
    var i = 0;
    setInterval(function() {
        var num = function() {
            return Math.floor(Math.random() * 255) + 1;
        };
        i++;
        console.log(i + " " + num() + "." + num() + "." + num() + " user connected.");
    }, 700);
}

setTimeout(function() {
    main();
}, 10);
```

### Better completer with dynamic values :

```js 
myRL.on("completer", function(arg) {
	if (arg.hits.length == 1) {
		arg.line = arg.hits[0];
	}

	arg.hits = completerId(".backup ", arg.line, arg.hits);
	arg.hits = completerId(".forceupdate ", arg.line, arg.hits);
	arg.hits = completerId(".open ", arg.line, arg.hits);
	arg.hits = completerId(".compare ", arg.line, arg.hits);
	arg.hits = completerId(".rename ", arg.line, arg.hits);
	arg.hits = completerId(".sandbox ", arg.line, arg.hits);
});

const user_id = [1, 2, 3, 4];
function completerId(cmd, line, hits, verify) {
	var verify = (verify) ? verify : function(id, index) {
		return true;
	};

	var t = [cmd];
	if (line.indexOf(cmd) == 0) {
		user_id.forEach(function(id, index) {
			if (!verify(id, index)) {
				return;
			}
			t.push(cmd + id);
		});
		hits = t.filter(function(c) {
			return c.indexOf(line) == 0;
		});
		if (hits.length == 0) {
			hits = t;
		}
	}
	return hits;
}
```

## Eval javascript command (like browser console) :

```js
myRL.on("line", function(line) {
    try {
        console.log(eval(line));
    } catch (e) {
        console.error(e);
    }
});
```


![linux pict](http://i.stack.imgur.com/BzH35.png)
