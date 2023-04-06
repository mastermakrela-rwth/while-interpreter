<script lang="ts">
	import type { Result } from '$lib/grammar/while_implementation';

	export let trace: Result[];
	export let show_steps = false;

	$: variables = [...new Set(trace.flatMap((r) => Object.keys(r)))];
</script>

<div class="overflow-x-scroll">
	<table class="mx-auto text-base text-center">
		<thead>
			<tr>
				{#if show_steps}
					<th class="text-left w-min"> Step </th>
				{/if}
				{#each variables as variable}
					<th>
						<code>{variable}</code>
					</th>
				{/each}
			</tr>
		</thead>
		{#each trace as row, idx}
			<tr class="odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
				{#if show_steps}
					<td class="text-left w-min">
						<span class="ml-2 text-gray-400">
							{idx}
						</span>
					</td>
				{/if}
				{#each variables as variable}
					{@const previous_value = trace[idx - 1]?.[variable] ?? ''}
					{@const current_value = row[variable] ?? ''}
					<td>
						<var class:changed={previous_value !== current_value}> {current_value} </var>
					</td>
				{/each}
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
