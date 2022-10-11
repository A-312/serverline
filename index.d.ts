import * as stream from "stream"
import * as rl from "readline"

declare module "serverline" {
	interface InitOptions {
		prompt?: string,
		ignoreErrors?: boolean,
		colorMode?: boolean | string,
		inspectOptions?: object,
		forceTerminalContext?: boolean,
	}
	/**
	 * Start serverline's readline.
	 */
	export function init(options?: InitOptions | string): void
	/**
	 * Display the query by writing it to the output,
	 * waits for user input to be provided on input and press `ENTER`,
	 * then invokes the callback function passing the provided input as the first argument.
	 */
	export function secret(query: string, callback: () => void): void
	/**
	 * Display the query by writing it to the output,
	 * waits for user input to be provided on input and press `ENTER`,
	 * then invokes the callback function passing the provided input as the first argument.
	 */
	export function question(query: string, callback: () => void): void
	/**
	 * Gets the current prompt that is written to output.
	 */
	export function getPrompt(): string
	/**
	 * Sets the prompt that will be written to output.
	 */
	export function setPrompt(strPrompt: string): void
	/**
	 * True if the input is hidden.
	 */
	export function isMuted(): boolean
	export function setMuted(enabled: boolean, strPrompt?: string): boolean
	export function setCompletion(obj: string[]): void
	/**
	 * Get History.
	 */
	export function getHistory(): string[]
	/**
	 * Rewrite history.
	 */
	export function setHistory(history: string[]): boolean
	export function getCollection(): {
		stdout: stream.Writable,
		stderr: stream.Writable
	}
	/**
	 * Returns the readline instance
	 * 
	 * We recommand to use `Serverline.<function>()` function instead of `Serverline.getRL().<function>()`.
	 */
	export function getRL(): rl.Interface
	/**
	 * Close the `readline.Interface` instance and relinquishe control over the `input` and `output` streams. When called, the `'close'` event will be emitted.
	 * 
	 * Calling `.close()` does not immediately stop other events (including `'line'`) from being emitted.
	 */
	export function close(): void
	/**
	 * Pause the `input` stream, allowing it to be resumed later if necessary.
	 * 
	 * Calling `.pause()` does not immediately stop other events (including `'line'`) from being emitted.
	 */
	export function pause(): void
	/**
	 * Resume the input stream if it has been paused.
	 */
	export function resume(): void
	/**
	 * The `'line'` event is emitted whenever the input stream receives an end-of-line input (`\n`, `\r`, or `\r\n`).
	 * This usually occurs when the user presses the `<Enter>`, or `<Return>` keys.
	 * 
	 * The listener function is called with a string containing the single line of received input.
	 */
	export function on(eventName: "line", callback: (line: string) => void): any
	/**
	 * You can make a better completer with dynamic values.
	 */
	export function on(eventName: "completer", callback: (arg: {
		line: string,
		hits: string[]
	}) => void): any
	/**
	 * The `'SIGINT'` event is emitted whenever the `input` stream receives a `<ctrl>-C` input, known typically as `SIGINT`.
	 * If there are no `'SIGINT'` event listeners registered when the input stream receives a `SIGINT`, the `'pause'` event will be emitted.
	 * 
	 * The listener function is invoked without passing any arguments.
	 */
	export function on(eventName: "SIGINT", callback: (rl: rl.Interface) => void): any
}
