<script lang="ts">
	import { onMount } from 'svelte';
	import type * as monaco from 'monaco-editor';
	import { createEditor } from './monaco_config';
	import { createEditor as createEditor2 } from './monaco_config_abstract_mashine';

	export let value: string;
	export let readOnly = false;
	export let wrap = true;
	export let language: 'while' | 'machine_code' = 'while';

	let Monaco: typeof monaco;
	let divEl: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor;
	let error: Error | undefined;

	onMount(async () => {
		// we have to do this like that because Cloudflare Pages doesn't like ttf
		Monaco = await import('monaco-editor');

		if (language == 'while') {
			editor = createEditor(divEl, value, Monaco, { readOnly, wordWrap: wrap ? 'on' : 'off' });
		} else if (language == 'machine_code') {
			editor = createEditor2(divEl, value, Monaco, readOnly);
		}

		const model = editor.getModel();

		if (!model) {
			error = new Error('No model');
			editor.dispose();
			return;
		}

		editor.onDidChangeModelContent(() => (value = model.getValue()));

		// Keyboard shortcuts
		// const runCodeFormat = () => editor.getAction('editor.action.formatDocument')?.run();
		// addEventListener(CustomEvents.keyboardFormat!.type, runCodeFormat);

		// return () => {
		// 	editor.dispose();
		// 	removeEventListener(CustomEvents.keyboardFormat!.type, runCodeFormat);
		// };
	});

	// MARK: Lifecycle
	$: if (editor && editor.getValue() !== value) {
		const pos = editor?.getPosition();
		editor?.setValue(value);
		if (pos) editor?.setPosition(pos);
	}
</script>

{#if error}
	<div class="h-full flex-1 bg-gray-800">
		<div class="h-full max-w-lg mx-auto grid content-center space-y-4">
			<h1 class="text-2xl">Oof, something went wrong</h1>
			<p class="text-lg text-gray-400">Please reload.</p>
			<p class="text-lg text-gray-400">
				Or try opening the document again from
				<a class="text-white underline" href="/"> the homepage </a>.
			</p>
		</div>
	</div>
{:else}
	<div bind:this={divEl} class="flex-1 overflow-hidden h-full bg-[#1e1e1e]" />
{/if}
