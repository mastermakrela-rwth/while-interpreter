<script lang="ts">
	import Katex from '$lib/Katex.svelte';

	export let trace: Vars[];
	export let show_steps = false;

	$: variables = [...new Set(trace.flatMap((r) => Object.keys(r)))];

	const get_row_variables = (row: Vars) => {
		return [...new Set(Object.keys(row))];
	};
</script>

<div class="overflow-x-scroll">
	<table class="mx-auto text-base text-center">
		<thead>
			<tr>
				{#if show_steps}
					<th class="text-left w-min"> Step </th>
					<th />
				{/if}
				{#each variables as variable}
					<th>
						<code>{variable}</code>
					</th>
				{/each}
				{#if show_steps}
					<th />
				{/if}
			</tr>
		</thead>
		{#each trace as row, idx}
			<tr class="odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
				{#if show_steps}
					{@const row_variables = get_row_variables(row)}
					<td>
						<span class="text-gray-400">
							{idx}.
						</span>
					</td>
					<td class="text-right">
						{#if row_variables.length <= 0}
							<Katex math={String.raw`\sigma(\empty) = \{`} />
						{:else}
							<Katex math={String.raw`\sigma(\{${row_variables}\}) = \{`} />
						{/if}
					</td>
				{/if}
				{#each variables as variable}
					{@const previous_value = trace[idx - 1]?.[variable] ?? ''}
					{@const current_value = row[variable] ?? ''}
					<td>
						<var class:changed={previous_value !== current_value}> {current_value} </var>
					</td>
				{/each}
				{#if show_steps}
					<td class="text-left">
						<Katex math={String.raw`\}`} />
					</td>
				{/if}
			</tr>
		{/each}
	</table>
</div>

<style lang="postcss">
	td {
		@apply text-gray-500;
	}

	.changed {
		@apply font-bold text-white;
	}

	th {
		width: 50px;
	}
</style>
