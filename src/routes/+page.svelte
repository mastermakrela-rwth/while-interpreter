<script lang="ts">
	import Playground from './Playground.svelte';
</script>

<section class="content-width">
	<h2>What is <code>WHILE</code>?</h2>

	<p>
		<code>WHILE</code> is a simple imperative programming language. It is used to learn the basic concepts
		of parsing, understanding, compiling verifying and executing programs.
	</p>

	<div>
		Compared to other programming languages, <code>WHILE</code> is very constrained. This allows a
		simple machine like human brain to understand and analyze the programs. It consists of:
		<ol>
			<li>Variables (<code>x</code>)</li>
			<li>Assignment (<code>x := 1</code>)</li>
			<li>Arithmetic expressions (<code>x := 1 + 2</code>)</li>
			<li>Boolean expressions (<code>x > 0</code>)</li>
			<li>While loops (<code>while x > 0 do x := x - 1 end</code>)</li>
			<li>Conditional statements (<code>if x > 0 then x := x - 1 else x := x + 1 end</code>)</li>
		</ol>
		So as a it's turing complete, it should be more than enough for any
		<em>real programmer</em>.
	</div>

	<p class="text-sm text-gray-500">
		(For full mathematical definition of the language, see <a
			class="text-sm text-gray-500"
			href="/mafs">here</a
		>)
	</p>
</section>

<section>
	<div class="content-width">
		<h2>Try it out!</h2>
	</div>

	<Playground />
</section>

<div class="h-96" />
