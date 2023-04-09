<script lang="ts">
	import Katex from '$lib/Katex.svelte';

	export let free_variables: Record<string, number> = {};

	let name = '';

	const add = () => {
		if (!name) return;

		free_variables[name] = 0;
		name = '';
	};

	const remove = (name: string) => {
		delete free_variables[name];
		free_variables = free_variables;
	};
</script>

<div class="disclaimer">
	<span class="font-semibold block mb-1">Disclaimer!</span>
	<span>
		Free variables will be detected automatically in the future. Now for sanity of our programmers
		we ask you to add them manually. :)
	</span>
</div>

<div class="flex justify-end items-center my-4 space-x-3">
	<label for="name" class="text-gray-300"> Identifier: </label>
	<input
		type="text"
		class="border px-4 py-1 rounded-full text-sm text-black"
		bind:value={name}
		on:keydown={(e) => {
			if (e.key === 'Enter') add();
		}}
	/>

	<button class="border px-4 py-1 rounded-full text-sm" on:click={add} disabled={!name}>
		Add
	</button>
</div>

{#each Object.entries(free_variables) as [name, value], i}
	<div class="flex justify-between items-center my-4">
		<div class="flex gap-1 items-center">
			<Katex math={`${name} :=`} />
			<input
				type="number"
				bind:value={free_variables[name]}
				class="border px-4 py-1 rounded-full text-sm text-black"
			/>
		</div>
		<button class="border px-4 py-1 rounded-full text-sm" on:click={() => remove(name)}>
			Remove
		</button>
	</div>
{/each}
