export type ExecutionConfiguration = {
	program_counter: number;
	stack: (number | boolean)[];
	state: Record<string, number>;
};

const compile_semantics: SemanticsOperation<ExecutionConfiguration> = {
	name: 'compile()',
	actions: {}
};

export const compile_operations = [compile_semantics];
