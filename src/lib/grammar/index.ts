import grammar from './while.ohm-bundle';
import { semantics, type ExpResult } from './while_implementation';

type Success = { success: true; result: ExpResult };
type Failure = { success: false; message?: string };
export type Interpretation = Success | Failure;

export const interpret_while = (program: string): Interpretation => {
	const m = grammar.match(program);

	if (m.failed()) {
		return { success: false, message: m.message };
	}

	try {
		const result = semantics(m).eval() as ExpResult;
		return { success: true, result };
	} catch (e) {
		const error = e as Error;
		return { success: false, message: error.message };
	}
};
