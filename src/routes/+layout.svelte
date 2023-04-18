<script>
	import '../app.postcss';
</script>

<svelte:head>
	<title>WHILE Interpreter</title>
</svelte:head>

<div class="prose dark:prose-invert max-w-none p-4 overflow-x-hidden">
	<div class="content-width">
		<h1>
			<code>WHILE</code> Interpreter
		</h1>
	</div>

	<slot />

	<footer class="content-width">
		<p class="text-gray-300">
			Version:
			<a
				href="https://github.com/mastermakrela-rwth/while-interpreter/CHANGELOG.md"
				target="_blank"
			>
				<code class="text-gray-300">{APP_VERSION}</code>
			</a>
		</p>
		<p>Crated by: <a href="https://github.com/mastermakrela" target="_blank">mastermakrela</a></p>
		<p>
			Based on Uni Course <a
				href="https://moves.rwth-aachen.de/teaching/ss-23/savos/"
				target="_blank"
			>
				Semantics and Verification of Software
			</a> in Summer Semester 2023
		</p>
		<p>
			Using wonderful <a href="https://ohmjs.org/" target="_blank">Ohm.js</a> and
			<a href="https://kit.svelte.dev/" target="_blank">SvelteKit</a>. (Full tech stack is a TODO.)
		</p>
		<p>
			You can find the code on GitHub <a
				href="https://github.com/mastermakrela-rwth/while-interpreter"
				target="_blank"
			>
				here
			</a>.
		</p>
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
