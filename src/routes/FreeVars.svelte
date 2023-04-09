<script lang="ts">
	import Katex from '$lib/Katex.svelte';

	export let defaults: string[];
	export let free_variables: Record<string, number>;

	free_variables = defaults.reduce<Record<string, number>>((acc, name) => {
		acc[name] = free_variables[name] ?? 0;
		return acc;
	}, {});
</script>

<div class="my-4 grid grid-cols-3 gap-4">
	{#each Object.entries(free_variables) as [name, value], i}
		<div class="flex gap-1 items-center">
			<Katex math={`${name} :=`} />
			<input
				type="number"
				bind:value={free_variables[name]}
				class="border px-4 py-1 rounded-full text-sm text-black"
			/>
		</div>
	{/each}
</div>

<div class="disclaimer">
	<span class="font-semibold block mb-1">Disclaimer!</span>
	<span>
		For now Free Variables work for Arithmetic Expressions only (And if you're lucky maybe somewhere
		else too). We need to add proper handling of Commands.
	</span>
</div>
