<script lang="ts">
	import { dev } from '$app/environment';
	import { programs } from '$lib/example_programs';
	import {
		eval_while,
		get_derivation_tree,
		get_free_vars,
		get_machine_code,
		parse_while
	} from '$lib/grammar/while';
	import MonacoEditor from '$lib/monaco/MonacoEditor.svelte';
	import { fade, slide } from 'svelte/transition';
	import FreeVars from './FreeVars.svelte';
	import MachineCodeEditor from './_parts/machine_code/MachineCodeEditor.svelte';
	import Results from './_parts/results/Results.svelte';
	import Derivation from './_parts/derivation/Derivation.svelte';

	const initial_program = programs[programs.length - 1];

	let input = initial_program.code;

	$: contains_while = input.includes('while');

	$: parsed = parse_while(input);

	let free_variables: string[] = [];
	$: if (parsed.success) free_variables = [...get_free_vars(parsed.result!)];
	$: if (dev) console.log('🚀 ~ file: Playground.svelte:20 ~ free_variables:', free_variables);

	let default_values: Record<string, number | null> = initial_program.initial_state;
	$: if (dev) console.log('🚀 ~ file: Playground.svelte:23 ~ default_values:', default_values);

	let eval_result: OptionalResult<EvalResult> | undefined = undefined;
	$: if (parsed.success) eval_result = eval_while(parsed.result!, default_values);
	$: if (dev) console.log('🚀 ~ file: Playground.svelte:27 ~ eval_result:', eval_result);

	let derivation_result: OptionalResult<DerivationTree> | undefined = undefined;
	$: if (parsed.success) derivation_result = get_derivation_tree(parsed.result!, default_values);
	$: if (dev) console.log('🚀 ~ file: Playground.svelte:31 ~ derivation:', derivation_result);

	let machine_code_result: OptionalResult<MachineCode> | undefined = undefined;
	$: if (parsed.success) machine_code_result = get_machine_code(parsed.result!);
	$: if (dev)
		console.log('🚀 ~ file: Playground.svelte:35 ~ machine_code_result:', machine_code_result);
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
</section>

<Results {eval_result} />

<Derivation {derivation_result} />

{#if machine_code_result}
	<MachineCodeEditor {machine_code_result} {default_values} />
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
