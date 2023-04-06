import grammar, { type WHILEActionDict } from '$lib/grammar/while.ohm-bundle';

export type Result = { [key: string]: number };

let vars: Result = {};
let trace: Result[] = [];

export type ExpResult = { result: Result; trace: Result[] };

const exp: Partial<WHILEActionDict<ExpResult>> = {
	Exp(cmd) {
		vars = {};
		trace = [];
		cmd.eval();
		trace.push({ ...vars });
		return {
			result: vars,
			trace: trace
		};
	}
};

const cmd: Partial<WHILEActionDict<void>> = {
	Cmd_seq(c1, _, c2) {
		c1.eval();
		c2.eval();
	},
	Cmd_if(_, cond, __, then, ___, _else, ____) {
		cond.eval() ? then.eval() : _else.eval();
	},
	Cmd_while(_, cond, __, body, ___) {
		while (cond.eval()) {
			body.eval();
		}
	},
	Cmd_assign(name, _, expr) {
		trace.push({ ...vars });
		vars[name.sourceString] = expr.eval();
	},
	Cmd_skip(_) {
		return;
	}
};

const b_exp: Partial<WHILEActionDict<boolean>> = {
	BExp_eq(a1, _, a2) {
		return a1.eval() === a2.eval();
	},
	BExp_gt(a1, _, a2) {
		return a1.eval() > a2.eval();
	},
	BExp_lt(a1, _, a2) {
		return a1.eval() < a2.eval();
	},
	BExp_geq(a1, _, a2) {
		return a1.eval() >= a2.eval();
	},
	BExp_leq(a1, _, a2) {
		return a1.eval() <= a2.eval();
	},
	BExp_not(_, b) {
		return !b.eval();
	},
	BExp_and(b1, _, b2) {
		return b1.eval() && b2.eval();
	},
	BExp_or(b1, _, b2) {
		return b1.eval() || b2.eval();
	}
};

const a_exp: Partial<WHILEActionDict<number>> = {
	AExp_add(a1, _, a2) {
		return a1.eval() + a2.eval();
	},
	AExp_sub(a1, _, a2) {
		return a1.eval() - a2.eval();
	},
	AExp_mul(a1, _, a2) {
		return a1.eval() * a2.eval();
	}
};

const bool: Partial<WHILEActionDict<boolean>> = {
	bool_true(_) {
		return true;
	},
	bool_false(_) {
		return false;
	}
};

const num: Partial<WHILEActionDict<number>> = {
	num_positive(num) {
		return +num.sourceString;
	},
	num_negative(_, num) {
		return -num.sourceString;
	}
};

const variable: Partial<WHILEActionDict<number>> = {
	var(name) {
		return vars[name.sourceString];
	}
};

export const semantics = grammar.createSemantics().addOperation('eval', {
	...exp,
	...cmd,
	...b_exp,
	...a_exp,
	...bool,
	...num,
	...variable
});
