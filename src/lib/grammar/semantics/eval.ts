import type { NonterminalNode } from 'ohm-js';

interface _NonterminalNode extends NonterminalNode {
	args: {
		vars: Vars;
		trace: Vars[];
	};
}

const program: Partial<WHILEActionDict<EvalResult>> = {
	Program(cmd) {
		cmd._eval(this.args.vars, this.args.trace);
		this.args.trace.push({ ...this.args.vars });
		return {
			result: this.args.vars,
			trace: this.args.trace
		};
	}
};

const cmd: Partial<WHILEActionDict<void>> = {
	Cmd_seq(c1, _, c2) {
		const { vars, trace } = (this as _NonterminalNode).args;

		c1._eval(vars, trace);
		c2._eval(vars, trace);
	},
	Cmd_if(_, cond, __, then, ___, _else, ____) {
		const { vars, trace } = (this as _NonterminalNode).args;

		cond._eval(vars, trace) ? then._eval(vars, trace) : _else._eval(vars, trace);
	},
	Cmd_while(_, cond, __, body, ___) {
		const { vars, trace } = (this as _NonterminalNode).args;

		while (cond._eval(vars, trace)) {
			body._eval(vars, trace);
		}
	},
	Cmd_assign(name, _, expr) {
		const { vars, trace } = (this as _NonterminalNode).args;

		trace.push({ ...vars });
		vars[name.sourceString] = expr._eval(vars, trace);
	},
	Cmd_skip(_) {
		return;
	}
};

const boolean_exp: Partial<WHILEActionDict<boolean>> = {
	BExp_and(b1, _, b2) {
		const { vars, trace } = (this as _NonterminalNode).args;

		// we evaluate both because one of our assumptions is that bool expressions are strict
		// i.e., always evaluate both arguments
		const cond1 = b1._eval(vars, trace);
		const cond2 = b2._eval(vars, trace);
		return cond1 && cond2;
	},
	BExp_or(b1, _, b2) {
		const { vars, trace } = (this as _NonterminalNode).args;

		// we evaluate both because one of our assumptions is that bool expressions are strict
		// i.e., always evaluate both arguments
		const cond1 = b1._eval(vars, trace);
		const cond2 = b2._eval(vars, trace);
		return cond1 || cond2;
	},
	BExp_not(_, b) {
		const { vars, trace } = (this as _NonterminalNode).args;
		return !b._eval(vars, trace);
	},

	PriBExp_paren(_, a, __) {
		const { vars, trace } = (this as _NonterminalNode).args;
		return a._eval(vars, trace);
	},

	PriBExp_eq(a1, _, a2) {
		const { vars, trace } = (this as _NonterminalNode).args;
		return a1._eval(vars, trace) === a2._eval(vars, trace);
	},
	PriBExp_gt(a1, _, a2) {
		const { vars, trace } = (this as _NonterminalNode).args;
		return a1._eval(vars, trace) > a2._eval(vars, trace);
	},
	PriBExp_lt(a1, _, a2) {
		const { vars, trace } = (this as _NonterminalNode).args;
		return a1._eval(vars, trace) < a2._eval(vars, trace);
	},
	PriBExp_geq(a1, _, a2) {
		const { vars, trace } = (this as _NonterminalNode).args;
		return a1._eval(vars, trace) >= a2._eval(vars, trace);
	},
	PriBExp_leq(a1, _, a2) {
		const { vars, trace } = (this as _NonterminalNode).args;
		return a1._eval(vars, trace) <= a2._eval(vars, trace);
	}
};

const arithmetic_exp: Partial<WHILEActionDict<number>> = {
	AExp_add(a1, _, a2) {
		const { vars, trace } = (this as _NonterminalNode).args;
		return a1._eval(vars, trace) + a2._eval(vars, trace);
	},
	AExp_sub(a1, _, a2) {
		const { vars, trace } = (this as _NonterminalNode).args;
		return a1._eval(vars, trace) - a2._eval(vars, trace);
	},
	AExp_mul(a1, _, a2) {
		const { vars, trace } = (this as _NonterminalNode).args;
		return a1._eval(vars, trace) * a2._eval(vars, trace);
	},
	PriAExp_paren(_, a, __) {
		const { vars, trace } = (this as _NonterminalNode).args;
		return a._eval(vars, trace);
	}
};

const bool: Partial<WHILEActionDict<boolean>> = {
	bool(arg0) {
		return arg0.sourceString === 'true';
	}
};

const number: Partial<WHILEActionDict<number>> = {
	number_positive(num) {
		return +num.sourceString;
	},
	number_negative(_, num) {
		return -num.sourceString;
	}
};

const variable: Partial<WHILEActionDict<number>> = {
	var(name) {
		return this.args.vars[name.sourceString];
	}
};

const _eval_semantics: SemanticsOperation<any> = {
	name: '_eval(vars, trace)',
	actions: {
		...program,
		...cmd,
		...boolean_exp,
		...arithmetic_exp,
		...bool,
		...number,
		...variable
	}
};

const eval_semantics: SemanticsOperation<EvalResult> = {
	name: 'eval()',
	actions: {
		Program(_) {
			const vars: Vars = {};
			const trace: Vars[] = [];

			this._eval(vars, trace);

			return {
				result: vars,
				trace: trace
			};
		}
	}
};

export const eval_operations = [_eval_semantics, eval_semantics];
