import type { NonterminalNode } from 'ohm-js';

type Stuff = {
	vars: Vars;
	var_gen: VariableGenerator;
	out_var: string;
};

class VariableGenerator {
	private map: Map<string, number> = new Map();

	gen(name: string) {
		const count = this.map.get(name) || 0;
		this.map.set(name, count + 1);

		return `${name}_${count}`;
	}

	genList(names: string[]) {
		return names.map((name) => this.gen(name));
	}
}

const rule = (_in: string, out: string) =>
	String.raw`\Braket{ ${_in}, \sigma } &\rightarrow ${out}`;
const condition = (cond: string) => String.raw`\text{where } ${cond}`;
const condition2 = (cond: string) => String.raw`\text{if } ${cond}`;

const program: Partial<WHILEActionDict<Derivation>> = {
	Program(_) {
		const vars: Vars = { ...this.args.stuff };
		const var_gen = new VariableGenerator();

		if (this.children.length > 1) {
			throw new Error('Programs with more than one command are not supported');
		}

		this._eval({ vars, trace: [], free_vars: [] });

		const z = var_gen.gen('z');
		const args: Stuff = { vars, var_gen, out_var: z };
		return this.child(0).derivation_tree(args);

		// TODO: add a rule for the program node
		return {
			name: this.ctorName,
			// premises: [this.child(0).derivation_tree({ vars, variable_gen })],
			premises: [],
			conclusion: {
				source: String.raw`\Braket{ ${this.sourceString}, \sigma } \rightarrow z`,
				rule: String.raw`\Braket{ \text{prog}, \sigma } \rightarrow z`
			}
		};
	}
};

const cmd: Partial<WHILEActionDict<Derivation>> = {
	// Cmd_seq(c1, _, c2) {
	// 	return {
	// 		name: this.ctorName,
	// 		premises: [c1.derivation_tree(this.args.stuff), c2.derivation_tree(this.args.stuff)],
	// 		conclusion: {
	// 			source: '',
	// 			rule: ''
	// 		}
	// 	};
	// },
	// Cmd_if(_, cond, __, then, ___, _else, ____) {
	// 	const { vars, trace } = (this as _NonterminalNode).args;
	// 	cond._eval(vars, trace) ? then._eval(vars, trace) : _else._eval(vars, trace);
	// },
	// Cmd_while(_, cond, __, body, ___) {
	// 	const { vars, trace } = (this as _NonterminalNode).args;
	// 	while (cond._eval(vars, trace)) {
	// 		body._eval(vars, trace);
	// 	}
	// },
	Cmd_assign(name, _, expr) {
		return expr.derivation_tree(this.args.stuff);
		return {
			name: this.ctorName,
			premises: [expr.derivation_tree(this.args.stuff)],
			conclusion: {
				source: '',
				rule: ''
			}
		};
	}
	// Cmd_skip(_) {
	// 	return {
	// 		name: this.ctorName,
	// 		premises: [],
	// 		conclusion: {
	// 			source: '',
	// 			rule: ''
	// 		}
	// 	};
	// }
};

const operator_to_tex: Record<string, string> = {
	'=': '=',
	'!=': '\\neq',
	'<': '<',
	'<=': '\\leq',
	'>': '>',
	'>=': '\\geq',
	'&&': '\\land',
	'||': '\\lor',
	'!': '\\neg'
};

const tex_string = (str: string) => {
	Object.entries(operator_to_tex).forEach(([op, tex]) => (str = str.replace(op, tex)));
	return str;
};

const interpret_bool = (_this: NonterminalNode, b_exp: NonterminalNode) => {
	const [a1, operator, a2] = b_exp.children;

	const { vars, var_gen, out_var } = _this.args.stuff as Stuff;
	const [a_1, a_2, z_1, z_2] = var_gen.genList(['a', 'a', 'z', 'z']);
	const value = b_exp._eval({ vars, trace: [], free_vars: [] });
	let cond = `${z_1} ${operator_to_tex[operator.sourceString]} ${z_2}`;
	if (!value) {
		cond = `\\neg (${cond})`;
	}
	return {
		name: _this.ctorName,
		premises: [
			a1.derivation_tree({ ..._this.args.stuff, out_var: z_1 }),
			a2.derivation_tree({ ..._this.args.stuff, out_var: z_2 })
		],
		conclusion: {
			source: rule(tex_string(b_exp.sourceString), value),
			rule: rule(`${a_1} = ${a_2}`, out_var)
		},
		conditions: [condition2(cond)]
	};
};

const boolean_exp: Partial<WHILEActionDict<Derivation>> = {
	BExp(b_exp) {
		if (b_exp.numChildren !== 3) {
			return this.child(0).derivation_tree(this.args.stuff);
		}

		return interpret_bool(this, b_exp);
	},
	BExp_not(_, b_exp) {
		const { vars, var_gen, out_var } = this.args.stuff as Stuff;
		const [b] = var_gen.genList(['b']);
		const value = this._eval({ vars, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [b_exp.derivation_tree({ ...this.args.stuff, out_var: b })],
			conclusion: {
				source: rule(`\\neg\\ ${b_exp.sourceString}`, value),
				rule: rule(`\\neg\\ ${b}`, `${value} =: ${out_var}`)
			}
		};
	},
	PriBExp(b_exp) {
		// CASE: plain bool value
		if (b_exp.numChildren === 1) {
			return this.child(0).derivation_tree(this.args.stuff);
		}

		// CASE: parenthesis
		const [a1, operator, a2] = b_exp.children;
		if (a1.isTerminal() && a2.isTerminal()) {
			return operator.derivation_tree(this.args.stuff);
		}

		// CASE: AExp comparison
		return interpret_bool(this, b_exp);
	}
};

const arithmetic_exp: Partial<WHILEActionDict<Derivation>> = {
	AExp_add(a1, _, a2) {
		const { vars, var_gen, out_var } = this.args.stuff as Stuff;
		const [a_1, a_2, z_1, z_2] = var_gen.genList(['a', 'a', 'z', 'z']);
		const value = this._eval({ vars, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [
				a1.derivation_tree({ ...this.args.stuff, out_var: z_1 }),
				a2.derivation_tree({ ...this.args.stuff, out_var: z_2 })
			],
			conclusion: {
				source: rule(this.sourceString, value),
				rule: rule(`${a_1} + ${a_2}`, out_var)
			},
			conditions: [`${out_var} := ${z_1} + ${z_2}`].map(condition)
		};
	},
	AExp_sub(a1, _, a2) {
		const { vars, var_gen, out_var } = this.args.stuff as Stuff;
		const [a_1, a_2, z_1, z_2] = var_gen.genList(['a', 'a', 'z', 'z', 'z']);
		const value = this._eval({ vars, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [
				a1.derivation_tree({ ...this.args.stuff, out_var: z_1 }),
				a2.derivation_tree({ ...this.args.stuff, out_var: z_2 })
			],
			conclusion: {
				source: rule(this.sourceString, value),
				rule: rule(`${a_1} - ${a_2}`, out_var)
			},
			conditions: [`${out_var} := ${z_1} - ${z_2}`].map(condition)
		};
	},
	AExp_mul(a1, _, a2) {
		const { vars, var_gen, out_var } = this.args.stuff as Stuff;

		const [a_1, a_2, z_1, z_2] = var_gen.genList(['a', 'a', 'z', 'z']);
		const value = this._eval({ vars, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [
				a1.derivation_tree({ ...this.args.stuff, out_var: z_1 }),
				a2.derivation_tree({ ...this.args.stuff, out_var: z_2 })
			],
			conclusion: {
				source: rule(this.sourceString, value),
				rule: rule(`${a_1} * ${a_2}`, out_var)
			},
			conditions: [`${out_var} := ${z_1} * ${z_2}`].map(condition)
		};
	},
	PriAExp_paren(arg0, arg1, arg2) {
		return arg1.derivation_tree(this.args.stuff);
	}
};

const bool: Partial<WHILEActionDict<Derivation>> = {
	bool(arg0) {
		const { vars, out_var } = this.args.stuff as Stuff;
		const value = this._eval({ vars, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [],
			conclusion: {
				source: rule(this.sourceString, value),
				rule: rule(this.sourceString, `${value} =: ${out_var}`)
			}
		};
	}
};

const number: Partial<WHILEActionDict<Derivation>> = {
	number(arg0) {
		const { vars, out_var } = this.args.stuff as Stuff;
		const value = this._eval({ vars, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [],
			conclusion: {
				source: rule(this.sourceString, value),
				rule: rule(this.sourceString, `${value} =: ${out_var}`)
			}
		};
	}
};

const variable: Partial<WHILEActionDict<Derivation>> = {
	var(name) {
		const { vars, out_var } = this.args.stuff as Stuff;
		const value = this._eval({ vars, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [],
			conclusion: {
				source: rule(this.sourceString, value),
				rule: rule(this.sourceString, `\\sigma(${this.sourceString}) =: ${out_var}`)
			}
		};
	}
};

const derivation_tree_semantics: SemanticsOperation<any> = {
	name: 'derivation_tree(stuff)',
	actions: {
		...program,
		...cmd,
		...boolean_exp,
		...arithmetic_exp,
		...bool,
		...number,
		...variable,
		_nonterminal(...children) {
			if (this.numChildren === 1) {
				return this.child(0).derivation_tree(this.args.stuff);
			} else {
				throw new Error(`${this.ctorName} not implemented`);
			}
		}
	}
};

export const derivation_tree_operations = [derivation_tree_semantics];
