import "./styles/index.scss"
import { mount } from "svelte";
import "../preload/custom.d.ts";
import type { WindowApi } from "../preload/custom.d.ts";
import App from "./App.svelte";

// TODO: why here
declare global {
	interface Window extends WindowApi {}
}

const rootEl = document.getElementById("root");

if (!rootEl) {
	throw new Error("App's #root is not defined");
}

mount(App, {
	target: rootEl,
});
