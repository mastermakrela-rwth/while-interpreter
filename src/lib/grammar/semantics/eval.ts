type Procedure = {
	name: string;
	args: string[];
	body: any; // TODO: figure this out
};

type Args = {
	vars: Vars;
	procedures: Record<string, Procedure>;
	trace: Vars[];
};

const program: Partial<WHILEActionDict<EvalResult>> = {
	Program(cmd) {
		const { vars, trace } = this.args.args as Args;

		cmd._eval(this.args.args);

		trace.push({ ...vars });
		return {
			result: vars,
			trace
		};
	}
};

const cmd: Partial<WHILEActionDict<void>> = {
	Cmd_seq(c1, _, c2) {
		c1._eval(this.args.args);
		c2._eval(this.args.args);
	},
	Cmd_if(_, cond, __, then, ___, _else, ____) {
		cond._eval(this.args.args) ? then._eval(this.args.args) : _else._eval(this.args.args);
	},
	Cmd_while(_, cond, __, body, ___) {
		while (cond._eval(this.args.args)) {
			body._eval(this.args.args);
		}
	},
	Cmd_assign(name, _, expr) {
		const { vars, trace } = this.args.args as Args;
		trace.push({ ...vars });
		vars[name.sourceString] = expr._eval(this.args.args);
	},
	Cmd_skip(_) {
		return;
	}
};

const boolean_exp: Partial<WHILEActionDict<boolean>> = {
	BExp_and(b1, _, b2) {
		// we evaluate both because one of our assumptions is that bool expressions are strict
		// i.e., always evaluate both arguments
		const cond1 = b1._eval(this.args.args);
		const cond2 = b2._eval(this.args.args);
		return cond1 && cond2;
	},
	BExp_or(b1, _, b2) {
		// we evaluate both because one of our assumptions is that bool expressions are strict
		// i.e., always evaluate both arguments
		const cond1 = b1._eval(this.args.args);
		const cond2 = b2._eval(this.args.args);
		return cond1 || cond2;
	},
	BExp_not(_, b) {
		return !b._eval(this.args.args);
	},

	PriBExp_paren(_, a, __) {
		return a._eval(this.args.args);
	},

	PriBExp_eq(a1, _, a2) {
		return a1._eval(this.args.args) === a2._eval(this.args.args);
	},
	PriBExp_gt(a1, _, a2) {
		return a1._eval(this.args.args) > a2._eval(this.args.args);
	},
	PriBExp_lt(a1, _, a2) {
		return a1._eval(this.args.args) < a2._eval(this.args.args);
	},
	PriBExp_geq(a1, _, a2) {
		return a1._eval(this.args.args) >= a2._eval(this.args.args);
	},
	PriBExp_leq(a1, _, a2) {
		return a1._eval(this.args.args) <= a2._eval(this.args.args);
	}
};

const arithmetic_exp: Partial<WHILEActionDict<number>> = {
	AExp_add(a1, _, a2) {
		return a1._eval(this.args.args) + a2._eval(this.args.args);
	},
	AExp_sub(a1, _, a2) {
		return a1._eval(this.args.args) - a2._eval(this.args.args);
	},
	AExp_mul(a1, _, a2) {
		return a1._eval(this.args.args) * a2._eval(this.args.args);
	},
	PriAExp_paren(_, a, __) {
		return a._eval(this.args.args);
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
		const { vars } = this.args.args as Args;

		return vars[name.sourceString];
	}
};

const _eval_semantics: SemanticsOperation<any> = {
	name: '_eval(args)',
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
	name: 'eval(default_values)',
	actions: {
		Program(_) {
			const default_values = this.args.default_values;
			const vars: Vars = { ...default_values };
			const trace: Vars[] = [];

			this._eval({ vars, trace });

			return {
				result: vars,
				trace: trace
			};
		}
	}
};

export const eval_operations = [_eval_semantics, eval_semantics];
