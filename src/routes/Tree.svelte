<script lang="ts">
	import Katex from '$lib/Katex.svelte';
	import domtoimage from 'dom-to-image';

	export let tree: DerivationTree;
	export let root = true;
	export let with_rules = true;

	let bg_div: HTMLDivElement;
	let content_div: HTMLDivElement;

	let x: number;
	$: if (bg_div) ({ x } = bg_div.getBoundingClientRect());
	let height: number;
	$: if (content_div) ({ height } = content_div.getBoundingClientRect());

	let expanded = true; //false;

	const update = () => {
		if (bg_div) ({ x } = bg_div.getBoundingClientRect());
		if (content_div) ({ height } = content_div.getBoundingClientRect());
	};

	const get_svg = async () => {
		const imageDataUrl = await domtoimage.toPng(content_div);
		const a = document.createElement('a');
		a.href = imageDataUrl;
		a.download = 'tree.png';
		a.click();
	};
</script>

<svelte:window on:resize={update} />

{#if root}
	<div on:resize={update}>
		<div class="content-width flex justify-between items-center mb-4">
			<div>
				<input id="with_rules" type="checkbox" bind:checked={with_rules} class="mr-2" />
				<label for="with_rules">With rules</label>
			</div>
			<!-- <button class="border px-4 py-1 rounded-full text-sm" on:click={get_svg}> Get SVG </button> -->
			<!-- <button class="border px-4 py-1 rounded-full text-sm" on:click={() => (expanded = !expanded)}>
				{#if expanded}
					Collapse
				{:else}
					Expand
				{/if}
			</button> -->
		</div>

		<div class="relative">
			<!-- <div bind:this={bg_div} class="w-full" style="height: {height}px;" /> -->

			<!-- <div
				bind:this={content_div}
				class="absolute top-0 left-0 w-full transitions overflow-x-scroll bg-gray-100 bg-opacity-25 py-4"
				style={expanded ? `left: -${x}px; min-width: 100dvw` : ''}
			> -->
			<div class="w-full overflow-x-scroll bg-gray-100 bg-opacity-25 py-4">
				<div class="rule w-min mx-auto">
					<span />
					<div class="flex gap-4 mb-6 items-end">
						{#each tree.premises?.filter(Boolean) ?? [] as premise}
							<svelte:self tree={premise} root={false} {with_rules} />
						{/each}
					</div>
					<span />

					<div class="text-xs">
						({tree.name})
					</div>

					<hr />

					<div>
						{#if with_rules}
							{#each tree.conditions ?? [] as condition}
								<Katex math={condition} displayMode />
							{/each}
						{/if}
					</div>

					<span />
					<div>
						{#if with_rules}
							<Katex
								math={String.raw`
\begin{align}
	${tree.conclusion.source} \\
	${tree.conclusion.rule}
\end{align}
			`}
								displayMode
							/>
						{:else}
							<Katex
								math={String.raw`\begin{align}${tree.conclusion.source}\end{align}`}
								displayMode
							/>
						{/if}
					</div>
					<span />
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="rule">
		<span />
		<div class="flex gap-4 mb-6 items-end">
			{#each tree.premises?.filter(Boolean) ?? [] as premise}
				<svelte:self tree={premise} root={false} {with_rules} />
			{/each}
		</div>
		<span />

		<div class="text-xs">
			({tree.name})
		</div>

		<hr />

		<div>
			{#if with_rules}
				{#each tree.conditions ?? [] as condition}
					<Katex math={condition} displayMode />
				{/each}
			{/if}
		</div>

		<span />
		<div>
			{#if with_rules}
				<Katex
					math={String.raw`
\begin{align}
	${tree.conclusion.source} \\
	${tree.conclusion.rule}
\end{align}
			`}
					displayMode
				/>
			{:else}
				<Katex math={String.raw`\begin{align}${tree.conclusion.source}\end{align}`} displayMode />
			{/if}
		</div>
		<span />
	</div>
{/if}

<style lang="postcss">
	.rule {
		@apply text-sm bg-opacity-25 px-4;
		@apply grid gap-x-2 items-center justify-items-center;
		grid-template-columns: max-content auto max-content;
	}

	hr {
		@apply m-2 border border-white w-full;
	}

	.transitions {
		transition: width 0.5s, left 0.5s, background-color 0.5s;
	}
</style>
