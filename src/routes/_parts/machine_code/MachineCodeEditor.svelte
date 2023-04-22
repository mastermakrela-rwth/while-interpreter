<script lang="ts">
	import Katex from '$lib/Katex.svelte';
	import MonacoEditor from '$lib/monaco/MonacoEditor.svelte';
	import { slide } from 'svelte/transition';

	export let machine_code_result: OptionalResult<MachineCode> | undefined = undefined;

	$: mc_error = machine_code_result?.success ? undefined : machine_code_result?.message;
</script>

<section class="content-width">
	<h3>Machine Code</h3>

	{#if machine_code_result}
		{#if !machine_code_result.success}
			<div class="error" transition:slide>
				<span class="font-semibold block mb-1">Error!</span>
				<span> {mc_error} </span>
			</div>
		{:else}
			{@const code = machine_code_result.result}

			<p>Line count: {code.split('\n').length}</p>

			<div class="h-[512px]">
				<MonacoEditor language="machine_code" value={code} readOnly wrap={false} />
			</div>
		{/if}

		<div class="disclaimer">
			<span class="font-semibold block mb-1">Disclaimer!</span>
			<span>
				This part didn't appear in the lecture (yet). So it's just authors' prediction of how the
				machine code could look like.
			</span>
		</div>

		<div class="disclaimer">
			<span class="font-semibold block mb-1">Note</span>
			<span>
				Right now for
				<Katex math={String.raw`>, \geq, <, \leq`} />
				we use instructions:
				<code>GT</code>, <code>GEQ</code>, <code>LT</code>, <code>LEQ</code>. Although all of them
				can be expressed using only
				<code>GT</code> and <code>NOT</code> instructions. We might add it in the future to the
				transpiler, but because we also control the runtime, we can just do this. <em>#lazy</em>
			</span>
		</div>
	{/if}
</section>
