<script lang="ts">
	import { dev } from '$app/environment';
	import Katex from '$lib/Katex.svelte';
	import { eval_while, get_derivation_tree, get_free_vars, parse_while } from '$lib/grammar';
	import MonacoEditor from '$lib/monaco/MonacoEditor.svelte';
	import { fade, slide } from 'svelte/transition';
	import FreeVars from './FreeVars.svelte';
	import Trace from './Trace.svelte';
	import Tree from './Tree.svelte';
	import { programs } from './example_programs';

	const initial_program = programs[programs.length - 1];

	let input = initial_program.code;
	let show_trace = false;

	$: contains_while = input.includes('while');

	$: parsed = parse_while(input);

	let free_variables: string[] = [];
	$: if (parsed.success) free_variables = [...get_free_vars(parsed.result!)];
	$: if (dev) console.log('🚀 ~ file: Playground.svelte:55 ~ free_variables:', free_variables);

	let default_values: Record<string, number | null> = initial_program.initial_state;
	$: if (dev) console.log('🚀 ~ file: Playground.svelte:58 ~ default_values:', default_values);

	let eval_result: OptionalResult<EvalResult> | undefined = undefined;
	$: if (parsed.success) eval_result = eval_while(parsed.result!, default_values);
	$: if (dev) console.log('🚀 ~ file: Playground.svelte:59 ~ eval_results:', eval_results);
	$: eval_results = eval_result?.success ? eval_result.result : undefined;

	let derivation: DerivationTree | undefined = undefined;
	let derivation_error: string | undefined = undefined;
	$: if (parsed.success) {
		const result = get_derivation_tree(parsed.result!, default_values);

		if (result.success) {
			derivation = result.result;
			derivation_error = undefined;
		} else {
			derivation = undefined;
			derivation_error = result.message;
		}
	}
	$: if (dev) console.log('🚀 ~ file: Playground.svelte:67 ~ derivation:', derivation);
</script>

<section class="content-width">
	<div class="h-[384px]">
		<MonacoEditor bind:value={input} />
	</div>

	<div class="my-4 flex flex-wrap items-center gap-2 text-sm">
		<span>Example programs:</span>
		{#each programs as program}
			<button
				class="btn"
				class:active={input === program.code}
				on:click={() => {
					input = program.code;
					default_values = program.initial_state;
				}}
			>
				{program.name}
			</button>
		{/each}
	</div>

	{#if contains_while}
		<div class="disclaimer" transition:fade>
			<span class="font-semibold block mb-1">Disclaimer!</span>
			<span>
				Your program contains the <code>while</code> loop. We can't determine if your program will terminate,
				so if your browser freezes, you were warned! If you know how to check if an arbitrary program
				terminates, please let us know!
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

	<h3>Results</h3>

	{#if eval_result?.success}
		{@const result = eval_result.result.result}
		{@const trace = eval_result.result.trace}
		<h4>
			<span> Final State </span>
			<span class="ml-4 text-gray-300"> ( <Katex math="\sigma(Var)" /> ) </span>
		</h4>

		<Trace trace={[result]} />

		<h4>
			<span> Execution trace </span>
			<span class="ml-4 text-gray-300"> ( <Katex math="\Sigma" /> ) </span>
		</h4>

		<div class="flex justify-between items-center">
			<p>{trace.length} Steps</p>

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
				<Trace show_steps {trace} />
			</div>
		{/if}
	{:else if eval_result}
		{@const message = eval_result.message}

		<div class="error">
			<span class="font-semibold block mb-1">Error!</span>
			<span> {message} </span>
		</div>
	{/if}

	<h3>Derivation</h3>

	<h4>Derivation Tree</h4>

	{#if !derivation}
		<div class="disclaimer">
			<span class="font-semibold block mb-1">Disclaimer!</span>
			<span>
				Derivation Trees work for Arithmetic and Boolean Expressions without any limitations. For
				programs with <code>while</code> loops, we have a depth limit.
			</span>
		</div>

		{#if derivation_error}
			<div class="error">
				<span class="font-semibold block mb-1">Error!</span>
				<span> {derivation_error} </span>
			</div>
		{/if}
	{/if}
</section>

{#if derivation}
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

	.btn.active {
		@apply bg-rwthBlue;
	}
</style>
