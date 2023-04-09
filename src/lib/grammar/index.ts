import grammar from './definitions/while.ohm-bundle';
import { derivation_tree_operations } from './semantics/derivation_tree';
import { eval_operations } from './semantics/eval';

const semantics = grammar.createSemantics();

eval_operations.forEach(({ name, actions }) => semantics.addOperation(name, actions));
derivation_tree_operations.forEach(({ name, actions }) => semantics.addOperation(name, actions));

export const interpret_while = (program: string, default_vars: Vars): Interpretation => {
	const m = grammar.match(program);

	if (m.failed()) {
		return { success: false, message: m.message };
	}

	try {
		const eval_result = semantics(m).eval() as EvalResult;
		let tree = undefined;
		try {
			tree = semantics(m).derivation_tree(default_vars);
			// eslint-disable-next-line no-empty
		} catch (e) {}

		return { success: true, result: { eval: eval_result, tree } };
	} catch (e) {
		const error = e as Error;
		return { success: false, message: error.message };
	}
};
