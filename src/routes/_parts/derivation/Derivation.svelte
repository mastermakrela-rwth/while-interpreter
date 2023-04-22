<script lang="ts">
	import Tree from './Tree.svelte';

	export let derivation_result: OptionalResult<DerivationTree> | undefined = undefined;
	$: derivation = derivation_result?.success ? derivation_result.result : undefined;
	$: derivation_error = derivation_result?.success ? undefined : derivation_result?.message;
</script>

<div class="content-width">
	<h3>Derivation</h3>

	<h4>Derivation Tree</h4>

	{#if !derivation}
		<div class="disclaimer">
			<span class="font-semibold block mb-1">Disclaimer!</span>
			<span>
				Derivation Trees work for Arithmetic and Boolean Expressions without any limitations. For
				programs with <code>while</code> loops, we have a depth limit.
			</span>
		</div>

		{#if derivation_error}
			<div class="error">
				<span class="font-semibold block mb-1">Error!</span>
				<span> {derivation_error} </span>
			</div>
		{/if}
	{/if}
</div>

{#if derivation}
	<div class="not-prose">
		<Tree tree={derivation} />
	</div>
{/if}
