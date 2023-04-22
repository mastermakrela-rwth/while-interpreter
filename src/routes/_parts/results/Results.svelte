<script lang="ts">
	import Katex from '$lib/Katex.svelte';
	import { slide } from 'svelte/transition';
	import Trace from './Trace.svelte';

	export let eval_result: OptionalResult<EvalResult> | undefined = undefined;

	let show_trace = false;
</script>

<div class="content-width">
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
</div>
