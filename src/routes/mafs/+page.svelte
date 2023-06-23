<script lang="ts">
	import Tree from '../_parts/derivation/Tree.svelte';

	const tree: DerivationTree = {
		name: 'cons',
		conclusion: {
			source: String.raw`\{A\} while x \neq 0 do x:=x-1 end \{B\}`,
			rule: ''
		},
		premises: [
			{
				name: '',
				conclusion: {
					source: String.raw`\vDash (A \Rightarrow A')`,
					rule: ''
				},
				premises: []
			},
			{
				name: 'while',
				conclusion: {
					source: String.raw`\{A'\} while x \neq 0 do x:=x-1 end \{x = 0 \land B'\}`,
					rule: ''
				},
				premises: [
					{
						name: 'cons',
						conclusion: {
							source: String.raw`\{x \neq 0 \land A'[x \mapsto x - 1] \} x:=x-1 \{A'\}`,
							rule: ''
						},
						premises: []
					}
				]
			},
			{
				name: '',
				conclusion: {
					source: String.raw`\vDash (x = 0 \land B' \Rightarrow B)`,
					rule: ''
				},
				premises: []
			}
		]
	};
</script>

<section class="content-width">
	<h2>Mafs</h2>
</section>

<!-- <Tree {tree} root /> -->
