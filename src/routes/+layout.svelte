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
		<p>Crated by: <a href="https://github.com/mastermakrela">mastermakrela</a></p>
		<p>
			Based on Uni Course <a href="https://moves.rwth-aachen.de/teaching/ss-23/savos/">
				Semantics and Verification of Software
			</a> in Summer Semester 2023
		</p>
		<p>
			Using wonderful <a href="https://ohmjs.org/">Ohm.js</a> and
			<a href="https://kit.svelte.dev/">SvelteKit</a>. (Full tech stack is a TODO.)
		</p>
		<p>
			You can find the code in GitHub <a
				href="https://github.com/mastermakrela-rwth/while-interpreter">here</a
			>.
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
