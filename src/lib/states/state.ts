import { writable } from "svelte/store";

export const submitted = writable(false);
export const notSubmitted = writable(false);