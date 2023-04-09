<script lang="ts">
	import { interpret_while } from '$lib/grammar';
	import Katex from '$lib/Katex.svelte';
	import MonacoEditor from '$lib/monaco/MonacoEditor.svelte';
	import { fade, slide } from 'svelte/transition';
	import type { Snapshot } from './$types';
	import Trace from './Trace.svelte';
	import Tree from './Tree.svelte';
	import FreeVars from './FreeVars.svelte';

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

	const equation_program = `
(2 - -4) * (11 - y)
`;

	const bool_equation_program = `
!1=1 || (true && 3 <= 4) 
`;

	let input = '(x+3)*(y-2)'; // default_program;
	let interpretation: Interpretation;
	let last_result: InterpretationResult | undefined = undefined;
	let show_trace = false;
	let free_variables: Record<string, number> = {};

	$: if (input) {
		interpretation = interpret_while(input, free_variables);
		if (interpretation.success) last_result = interpretation.result;
	}

	export const snapshot: Snapshot = {
		capture: () => {
			return { input, show_trace };
		},
		restore: ({ input, show_trace }) => {
			input = input;
			show_trace = show_trace;
		}
	};

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
	<button class="btn" on:click={() => (input = equation_program)}> Equation </button>
	<button class="btn" on:click={() => (input = bool_equation_program)}> Boolean Equation </button>
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
		{#if !result.tree}
			<h4>
				<span>
					{#if !interpretation.success}Last{/if}
					Final State
				</span>
				<span class="ml-4 text-gray-300">
					( <Katex math="\sigma(Var)" /> )
				</span>
			</h4>

			<Trace trace={[result.eval.result]} />

			<h4>
				<span>
					{#if !interpretation.success}Last{/if}
					Execution trace
				</span>
				<span class="ml-4 text-gray-300">
					( <Katex math="\Sigma" /> )
				</span>
			</h4>

			<div class="flex justify-between items-center">
				<p>{result.eval.trace.length} Steps</p>

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
					<Trace show_steps trace={result.eval.trace} />
				</div>
			{/if}
		{:else}
			<h3>
				{#if !interpretation.success}Last{/if}
				Results
			</h3>

			<h4>
				<span> Free Variables </span>
			</h4>

			<FreeVars bind:free_variables />

			<h4>
				<span>
					{#if !interpretation.success}Last{/if}
					Derivation Tree
				</span>
			</h4>

			<div class="not-prose">
				<Tree tree={result.tree} />
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

	.btn {
		@apply px-4 py-1;
		@apply bg-slate-700 text-slate-100;
		@apply rounded-full;
		@apply hover:bg-slate-600;
		@apply focus:outline-none focus:ring-2 focus:ring-slate-600;
	}
</style>
