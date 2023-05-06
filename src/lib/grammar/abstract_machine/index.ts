import type { MatchResult } from 'ohm-js';
import grammar from './definitions/abstract_machine.ohm-bundle';
import { compile_operations } from './semantics/compile';

const am_semantics = grammar.createSemantics();

compile_operations.forEach(({ name, actions }) => am_semantics.addOperation(name, actions));

export const parse_machine_code = (code: string) => {
	const m = grammar.match(code);

	if (m.failed()) {
		return { success: false, message: m.message };
	}

	return { success: true, result: m };
};

export const compile_machine_code = (m: MatchResult): CompiledAM => {
	return am_semantics(m).compile(null);
};

// export const execute_machine_code = (m: MatchResult): OptionalResult<ExecutionConfiguration> => {
// 	const initial_configuration: ExecutionConfiguration = {
// 		program_counter: 0,
// 		stack: [],
// 		state: {}
// 	};

// 	return { success: false, message: 'Not implemented' };
// 	// this won't work
// 	// try {
// 	// 	const result = am_semantics(m).execute(initial_configuration);
// 	// 	return { success: true, result };
// 	// } catch (e) {
// 	// 	console.warn('execute_machine_code', e);
// 	// 	return { success: false, message: (e as Error).message };
// 	// }
// };
