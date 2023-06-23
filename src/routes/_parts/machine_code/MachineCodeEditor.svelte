<script lang="ts">
	import { compile_machine_code, parse_machine_code } from '$lib/grammar/abstract_machine';
	import MonacoEditor from '$lib/monaco/MonacoEditor.svelte';
	import { slide } from 'svelte/transition';
	import ExecutionStepper from './ExecutionStepper.svelte';

	export let machine_code_result: OptionalResult<MachineCode>;
	export let default_values: Record<string, number | null>;

	let compiled: CompiledAM | undefined = undefined;
	$: if (machine_code_result?.success) {
		const code = machine_code_result.result;
		const parsed = parse_machine_code(code);

		if (parsed.success) {
			compiled = compile_machine_code(parsed.result!);
		}
	}
</script>

<section class="content-width">
	<h3>Machine Code</h3>

	<div class="disclaimer">
		<span class="font-semibold block mb-1">Disclaimer!</span>
		<span>
			This part partly appeared in the lecture. But it's (still) just authors' interpretation,
			motivated by implementation details and previous preconceptions.
		</span>
	</div>

	{#if machine_code_result}
		{#if !machine_code_result.success}
			{@const mc_error = machine_code_result.message}
			<div class="error" transition:slide|global>
				<span class="font-semibold block mb-1">Error!</span>
				<span> {mc_error} </span>
			</div>
		{:else}
			{@const code = machine_code_result.result}

			<div class="h-[512px] my-4">
				<MonacoEditor language="machine_code" value={code} readOnly wrap={false} />
			</div>
		{/if}

		{#if compiled}
			{#key compiled}
				{#key default_values}
					<ExecutionStepper program={compiled} {default_values} />
				{/key}
			{/key}
		{/if}
	{/if}
</section>
