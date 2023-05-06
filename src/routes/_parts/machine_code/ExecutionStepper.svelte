<script lang="ts">
	import Katex from '$lib/Katex.svelte';
	import { slide } from 'svelte/transition';

	type State = Record<string, number | null>;
	type Step = {
		step: number;
		instruction: string;
		pc: number;
		stack: number[];
		state: State;
		state_delta?: State;
	};

	function getObjectDifference(prev: State, curr: State) {
		const result: State = {};
		let empty = true;

		for (const key in curr) {
			if (prev[key] !== curr[key]) {
				result[key] = curr[key];
				empty = false;
			}
		}

		return empty ? undefined : result;
	}

	export let program: CompiledAM;
	const { lines, line_count } = program;
	export let default_values: Record<string, number | null> = {};
	export let max_steps = 1000;

	let display: 'math' | 'table' = 'table';

	let current_configuration: ExecutionConfiguration = {
		program_counter: 1,
		stack: [],
		state: default_values
	};
	let step_count = 0;
	let steps: Step[] = [];
	let error: string | undefined = undefined;

	let finished = false;
	while (!finished) {
		const line = lines[current_configuration.program_counter];

		// check constraints
		try {
			line.constraints.forEach((constraint) => {
				constraint({ ...current_configuration });
			});
		} catch (e) {
			error = (e as Error).message;
			finished = true;
			break;
		}

		const previous_state = { ...current_configuration.state };
		current_configuration = line.apply(current_configuration);

		steps = [
			...steps,
			{
				step: ++step_count,
				instruction: line.operation,
				// in the lecture we define pc as the currently executed instruction, but in implementation it's the next instruction to be executed
				pc: current_configuration.program_counter - 1,
				stack: [...current_configuration.stack],
				state: { ...current_configuration.state },
				state_delta: getObjectDifference(previous_state, current_configuration.state)
			}
		];

		if (
			current_configuration.program_counter <= 0 ||
			current_configuration.program_counter > line_count ||
			step_count >= max_steps
		) {
			finished = true;
		}
	}

	const pretty_print_state = (state: Record<string, number | null>) => {
		return (
			'{ ' +
			Object.entries(state)
				.map(([key, value]) => {
					return `${key} → ${value}`;
				})
				.join('; ') +
			' }'
		);
	};

	const step_to_tex = (step: Step) => {
		const { instruction, pc, stack, state_delta, state } = step;

		const _rhd = pc <= 1 ? '' : '\\rhd';
		const _stack = stack.join(' : ') || '\\varepsilon';
		const _sigma = '\\sigma' + (state_delta ? `[${pretty_print_state(state_delta)}]` : '');
		const _state = pretty_print_state(state).replaceAll('→', '\\mapsto');

		return String.raw`
&\color{#64748b}\text{${instruction}}\color{unset}\enspace
&${_rhd}\medspace⟨\medspace
&${pc},\enspace
&${_stack},\enspace
&${_sigma}\medspace⟩\enspace
&\footnotesize\color{#94a3b8}\{${_state}\}\color{unset}\normalsize
`.replaceAll('\n', '');
	};

	const execution_to_tex = (steps: Step[]) => {
		const join = String.raw` \\ `;

		return String.raw`
\begin{alignat}{4}
	${steps.map(step_to_tex).join(join)}
\end{alignat}
	`;
	};

	const math = execution_to_tex(steps);
</script>

<div class="flex justify-evenly mb-4 bg-slate-700">
	<button class="p-2" on:click={() => (display = 'table')} class:active={display === 'table'}>
		Table
	</button>
	<button class="p-2" on:click={() => (display = 'math')} class:active={display === 'math'}>
		Math
		<span class="text-sm">
			(<Katex
				math={String.raw`⟨\medspace |P|, \enspace \varepsilon, \enspace \sigma \medspace⟩`}
			/>)
		</span>
	</button>
</div>

<div class="disclaimer">
	<span class="font-semibold block mb-1">Warning!</span>
	<span>
		The computation chains can get pretty long and the TeX renderer isn't a fan of that. So when
		choosing <b>Math</b> the browser might get slow.
	</span>
</div>

<div class="bg-slate-900 p-4 px-2">
	{#if display === 'math'}
		<Katex displayMode {math} />
	{:else}
		<table class="m-0">
			<thead>
				<tr>
					<th class="p-2">Step</th>
					<th>Instruction</th>
					<th>PC</th>
					<th>Stack</th>
					<th>State</th>
				</tr>
			</thead>
			<tbody>
				{#each steps as { step, instruction, pc, stack, state } (step)}
					<tr class="odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
						<td class="p-2">{step}</td>
						<td>
							<var>{instruction}</var>
						</td>
						<td>
							<code>{pc}</code>
						</td>
						<td>[{stack.join(':')}]</td>
						<td> {pretty_print_state(state)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

{#if error}
	<div transition:slide>
		<h3>Something went wrong!</h3>
		<pre class="error">{error}</pre>
	</div>
{/if}

<style lang="postcss">
	button {
		@apply w-full p-2 border-b border-slate-800;
		@apply transition-colors duration-300;
		@apply hover:bg-slate-600;
	}

	button.active {
		@apply border-white font-semibold;
	}
</style>
