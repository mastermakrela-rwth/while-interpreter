import type { MatchResult } from 'ohm-js';
import grammar from './definitions/while.ohm-bundle';
import { derivation_tree_operations } from './semantics/derivation_tree';
import { eval_operations } from './semantics/eval';
import { free_variables_operations } from './semantics/free_variables';

const semantics = grammar.createSemantics();

eval_operations.forEach(({ name, actions }) => semantics.addOperation(name, actions));
free_variables_operations.forEach(({ name, actions }) => semantics.addOperation(name, actions));
derivation_tree_operations.forEach(({ name, actions }) => semantics.addOperation(name, actions));

export const parse_while = (program: string) => {
	const m = grammar.match(program);

	if (m.failed()) {
		return { success: false, message: m.message };
	}

	return { success: true, result: m };
};

export const get_free_vars = (m: MatchResult): string[] => {
	return semantics(m).free_vars({});
};

export const eval_while = (m: MatchResult, default_vars: Vars): OptionalResult<EvalResult> => {
	try {
		const result = semantics(m).eval(default_vars);
		return { success: true, result };
	} catch (e) {
		console.warn('eval_while', e);
		return { success: false, message: (e as Error).message };
	}
};

export const get_derivation_tree = (
	m: MatchResult,
	default_vars: Vars
): OptionalResult<DerivationTree> => {
	try {
		const result = semantics(m).derivation_tree(default_vars);
		return { success: true, result };
	} catch (e) {
		console.warn('get_derivation_tree', e);
		return { success: false, message: (e as Error).message };
	}
};
