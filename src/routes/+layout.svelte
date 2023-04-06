<script>
	import '../app.postcss';
</script>

<svelte:head>
	<title>WHILE Interpreter</title>
</svelte:head>

<div class="mx-auto prose dark:prose-invert max-w-4xl p-4">
	<h1>
		<code>WHILE</code> Interpreter
	</h1>

	<slot />

	<footer>
		Crated by: <a href="https://github.com/mastermakrela">mastermakrela</a>
	</footer>
</div>

<style lang="postcss">
	footer {
		@apply py-2;
		@apply border-t border-gray-600;
		@apply text-gray-500 text-xs text-center;
	}

	footer a {
		@apply text-gray-500;
	}
</style>
