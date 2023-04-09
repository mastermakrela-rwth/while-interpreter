<script lang="ts">
	import { dev } from '$app/environment';
	import Katex from '$lib/Katex.svelte';
	import { eval_while, get_derivation_tree, get_free_vars, parse_while } from '$lib/grammar';
	import MonacoEditor from '$lib/monaco/MonacoEditor.svelte';
	import { fade, slide } from 'svelte/transition';
	import FreeVars from './FreeVars.svelte';
	import Trace from './Trace.svelte';
	import Tree from './Tree.svelte';

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
z := (x+3) * (y-2)
`;
	const equation_derivation_program = `
(2 - -4) * (11 - y)
`;

	const bool_equation_program = `
!1=1 || (true && 3 <= 4) 
`;

	let input = equation_program;
	let show_trace = false;

	$: contains_while = input.includes('while');

	$: parsed = parse_while(input);

	let free_variables: string[] = [];
	$: if (parsed.success) free_variables = [...get_free_vars(parsed.result!)];
	$: if (dev) console.log('🚀 ~ file: Playground.svelte:55 ~ free_variables:', free_variables);

	let default_values: Record<string, number> = { x: 3, y: 9 };
	$: if (dev) console.log('🚀 ~ file: Playground.svelte:58 ~ default_values:', default_values);

	let eval_results: EvalResult | undefined = undefined;
	$: if (parsed.success) eval_results = eval_while(parsed.result!, default_values);
	$: if (dev) console.log('🚀 ~ file: Playground.svelte:59 ~ eval_results:', eval_results);

	let derivation: DerivationTree | undefined = undefined;
	$: if (parsed.success) derivation = get_derivation_tree(parsed.result!, default_values);
	$: if (dev) console.log('🚀 ~ file: Playground.svelte:67 ~ derivation:', derivation);
</script>

<div class="h-[384px]">
	<MonacoEditor bind:value={input} />
</div>

<div class="my-4 flex flex-wrap items-center gap-2 text-sm">
	<span>Example programs:</span>
	<button class="btn" on:click={() => (input = default_program)}> 42 </button>
	<button class="btn" on:click={() => (input = fibonacci_program)}> Fibonacci </button>
	<button class="btn" on:click={() => (input = equation_program)}> Equation </button>
	<button class="btn" on:click={() => (input = equation_derivation_program)}>
		Equation Derivation
	</button>
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

{#if !parsed.success}
	<div transition:slide>
		<h3>Something went wrong!</h3>
		<pre class="error">{parsed.message}</pre>
	</div>
{/if}

{#if free_variables.length > 0}
	<div transition:fade>
		<h4>Free Variables</h4>

		{#key free_variables.join('@')}
			<FreeVars defaults={free_variables} bind:free_variables={default_values} />
		{/key}
	</div>
{/if}

{#if eval_results}
	<h3>Results</h3>

	<h4>
		<span> Final State </span>
		<span class="ml-4 text-gray-300">
			( <Katex math="\sigma(Var)" /> )
		</span>
	</h4>

	<Trace trace={[eval_results.result]} />

	<h4>
		<span> Execution trace </span>
		<span class="ml-4 text-gray-300">
			( <Katex math="\Sigma" /> )
		</span>
	</h4>

	<div class="flex justify-between items-center">
		<p>{eval_results.trace.length} Steps</p>

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
			<Trace show_steps trace={eval_results.trace} />
		</div>
	{/if}
{/if}

{#if derivation}
	<h3>Derivation</h3>

	<h4>Derivation Tree</h4>

	<div class="disclaimer">
		<span class="font-semibold block mb-1">Disclaimer!</span>
		<span>
			For now Derivation Trees work for Arithmetic and Boolean Expressions only. We need to add
			proper Commands rules.
		</span>
	</div>

	<div class="not-prose">
		<Tree tree={derivation} />
	</div>
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
