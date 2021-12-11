import * as stream from "stream"
import * as rl from "readline"

declare module "serverline" {
	export function init(options: string): void
	export function secret(query: string, callback: () => {}): void
	export function question(): void
	export function getPrompt(): string
	export function setPrompt(strPrompt: string): void
	export function isMuted(): boolean
	export function setMuted(enabled: boolean, msg?: string): boolean
	export function setCompletion(obj: object): void
	export function getHistory(): string[]
	export function setHistory(history: string[]): boolean
	export function getCollection(): {
		stdout: stream.Writable,
		stderr: stream.Writable
	}
	export function getRL(): rl.Interface
	export function close(): void
	export function pause(): void
	export function resume(): void
	export function on(eventName?: "line" | "SIGINT" | "completer"): any
}