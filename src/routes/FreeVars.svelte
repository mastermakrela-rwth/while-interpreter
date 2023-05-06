<script lang="ts">
	import Katex from '$lib/Katex.svelte';

	export let defaults: string[];
	export let free_variables: Record<string, number | null>;

	// free_variables = defaults.reduce<Record<string, number>>((acc, name) => {
	// 	acc[name] = free_variables[name] ?? 0;
	// 	return acc;
	// }, {});

	$: if (defaults) {
		free_variables = defaults.reduce<Record<string, number>>((acc, name) => {
			acc[name] = free_variables[name] ?? 0;
			return acc;
		}, {});
	}
</script>

<div class="my-4 grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
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
