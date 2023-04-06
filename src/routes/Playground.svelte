<script lang="ts">
	import { interpret_while, type Interpretation } from '$lib/grammar';
	import type { ExpResult, Result } from '$lib/grammar/while_implementation';
	import MonacoEditor from '$lib/monaco/MonacoEditor.svelte';
	import { fade, slide } from 'svelte/transition';
	import Trace from './Trace.svelte';

	const default_program = `
x := 6;
y := 7;
z := 0;
while x > 0 do
	x := x - 1;
	v := y;
	while v > 0 do
		v := v - 1;
		z := z + 1
	end
end
`;

	const fibonacci_program = `
x := 0;
y := 1;
z := 0;
while x < 100 do
	z := x + y;
	x := y;
	y := z
end
`;

	let input = default_program;
	let interpretation: Interpretation;
	let last_result: ExpResult | undefined = undefined;
	let show_trace = false;

	$: if (input) {
		interpretation = interpret_while(input);
		if (interpretation.success) last_result = interpretation.result;
	}

	$: result = interpretation.success ? interpretation.result : last_result;
	$: contains_while = input.includes('while');
</script>

<div class="h-[384px]">
	<MonacoEditor bind:value={input} />
</div>

<div class="my-4 flex flex-wrap items-center gap-2 text-sm">
	<span>Example programs:</span>
	<button class="btn" on:click={() => (input = default_program)}> 42 </button>
	<button class="btn" on:click={() => (input = fibonacci_program)}> Fibonacci </button>
</div>

{#if contains_while}
	<div class="disclaimer" transition:fade>
		<span class="font-semibold block mb-1">Disclaimer!</span>
		<span>
			Your program contains the <code>while</code> loop. We can't determine if your program will terminate,
			so if your browser freezes, you were warned! If you know how to check if an arbitrary program terminates,
			please let us know!
		</span>
	</div>
{/if}

{#if interpretation}
	{#if !interpretation.success}
		<div transition:slide>
			<h3>Something went wrong!</h3>
			<pre class="error">{interpretation.message}</pre>
		</div>
	{/if}

	{#if result}
		<h3>
			{#if !interpretation.success}Last{/if}
			Results
		</h3>

		<Trace trace={[result.result]} />

		<h4>
			{#if !interpretation.success}Last{/if}
			Execution trace
		</h4>

		<div class="flex justify-between items-center">
			<p>{result.trace.length} Steps</p>

			<button
				class="border px-4 py-1 rounded-full text-sm"
				on:click={() => (show_trace = !show_trace)}
			>
				{#if show_trace}
					Hide trace
				{:else}
					Show trace
				{/if}
			</button>
		</div>

		{#if show_trace}
			<div transition:slide={{ duration: 1000 }}>
				<Trace show_steps trace={result.trace} />
			</div>
		{/if}
	{/if}
{/if}

<style lang="postcss">
	.error::before {
		content: '';
		@apply absolute inset-0 -z-10;
		@apply w-full h-full bg-red-700 bg-opacity-50;
	}
	.error {
		@apply relative z-10;
	}

	.disclaimer::before {
		content: '';
		@apply absolute inset-0 -z-10;
		@apply w-full h-full bg-yellow-600 bg-opacity-25;
	}
	.disclaimer {
		@apply relative z-10;
		@apply text-xs italic;
		@apply my-2 p-2 pl-3  bg-slate-700;
		@apply border-l-4 border-yellow-600;
	}

	.btn {
		@apply px-4 py-1;
		@apply bg-slate-700 text-slate-100;
		@apply rounded-full;
		@apply hover:bg-slate-600;
		@apply focus:outline-none focus:ring-2 focus:ring-slate-600;
	}
</style>
