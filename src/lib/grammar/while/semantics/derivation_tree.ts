import type { NonterminalNode } from 'ohm-js';

type Stuff = {
	var_gen: VariableGenerator;
	state: State;
	cmd_only: boolean;
	out_var: string;
	while_depth: number;
};

class VariableGenerator {
	private map: Map<string, number> = new Map();

	gen(name: string) {
		const count = this.map.get(name) || 0;
		this.map.set(name, count + 1);

		if (name === 'sigma') {
			const apostrophe = "'".repeat(count);
			return `\\sigma ${apostrophe}`;
		}

		return `${name}_{${count}}`;
	}

	genList(names: string[]) {
		return names.map((name) => this.gen(name));
	}
}

class State {
	private _state: Record<string, number>;
	private _trace: { symbol: string; state: Record<string, number> }[];

	constructor(state: Record<string, number> = {}) {
		this._state = state;
		this._trace = [{ symbol: '\\sigma', state: { ...state } }];
	}

	get state() {
		return this._state;
	}

	get trace() {
		return this._trace;
	}

	assign(name: string, value: number) {
		this._state[name] = value;
		this._trace.push({ symbol: this.symbol, state: { ...this._state } });
	}

	value(name: string) {
		return this._state[name];
	}

	private _colors = [
		'#fef9c3',
		'#fef3c7',
		'#fef08a',
		'#fde68a',
		'#fde047',
		'#fcd34d',
		'#facc15',
		'#fbbf24',
		'#eab308',
		'#f59e0b',
		'#ca8a04',
		'#d97706'
	];

	get symbol(): string {
		const count = this._trace.length - 1;
		const color = this._colors[count % this._colors.length];

		return String.raw`\color{${color}} \sigma_{${count}} \color{unset}`;
	}
}

const rule = (exp: string, state: string, out: string) =>
	String.raw`\Braket{ ${exp}, ${state} } &\rightarrow ${out}`;

const condition = (cond: string) => String.raw`\text{where } ${cond}`;
const condition2 = (cond: string) => String.raw`\text{if } ${cond}`;

const program: Partial<WHILEActionDict<Derivation>> = {
	Program(_) {
		const var_gen = new VariableGenerator();
		const state = new State();
		Object.entries(this.args.stuff).forEach(([name, value]) => {
			state.assign(name, value as number);
		});

		const z = var_gen.gen('z');
		const args: Stuff = {
			var_gen,
			out_var: z,
			cmd_only: false,
			state,
			while_depth: 0
		};

		const ret = this.child(0).derivation_tree(args);

		return ret;
	}
};

const cmd: Partial<WHILEActionDict<Derivation>> = {
	Cmd_while(_, cond, __, body, ___) {
		const { var_gen, state } = this.args.stuff as Stuff;

		this.args.stuff.while_depth++;

		if (this.args.stuff.while_depth > 10) {
			throw new Error('while depth limit exceeded');
		}

		const sigma_in = state.symbol;

		const [b, c] = var_gen.genList(['b', 'c']);
		const cond_value = cond._eval({ vars: { ...state.state }, trace: [] });

		const p1 = cond.derivation_tree({ ...this.args.stuff, out_var: b });
		let p2, p3;
		if (cond_value) {
			p2 = body.derivation_tree({ ...this.args.stuff, out_var: b });
			p3 = this.derivation_tree({ ...this.args.stuff });
		}

		const sigma_out = state.symbol;

		const formatted_rule = String.raw`
\text{while } \color{#a7f3d0} ${b} \color{unset}
\text{ do } \color{#bae6fd} ${c} \color{unset}
\text{ end}
		`;
		const formatted_source = String.raw`
\text{while } \color{#a7f3d0} ${cond.latex} \color{unset}
\text{ do } \color{#bae6fd} ${body.latex} \color{unset}
\text{ end}
		`;

		return {
			name: cond_value ? 'while-true' : 'while-false',
			premises: cond_value ? [p1, p2, p3] : [p1],
			conclusion: {
				// source: String.raw`\Braket{ ${formatted_source}, ${sigma_in} } &\rightarrow ${sigma_out}`,
				source: rule(formatted_source, sigma_in, sigma_out),
				// rule: String.raw`\Braket{ ${formatted_rule}, ${sigma_in} } &\rightarrow ${sigma_out}`
				rule: rule(formatted_rule, sigma_in, sigma_out)
			}
		};
	},
	Cmd_if(_, cond, __, then, ___, _else, ____) {
		const { var_gen, state } = this.args.stuff as Stuff;

		const sigma_in = state.symbol;

		const cond_value = cond._eval({ vars: { ...state.state }, trace: [] });

		const [b, c1, c2] = var_gen.genList(['b', 'c', 'c']);
		const p1 = cond.derivation_tree({ ...this.args.stuff, out_var: b });

		let p2;
		if (cond_value) {
			p2 = then.derivation_tree({ ...this.args.stuff });
		} else {
			p2 = _else.derivation_tree({ ...this.args.stuff });
		}

		const sigma_out = state.symbol;

		const formatted_rule = String.raw`
\text{if } \color{#a7f3d0} ${b} \color{unset}
\text{ then } \color{#bae6fd} ${c1} \color{unset}
\text{ else } \color{#f5d0fe} ${c2} \color{unset}
\text{ end}
		`;
		const formatted_source = String.raw`
\text{if } \color{#a7f3d0} ${cond.latex} \color{unset}
\text{ then } \color{#bae6fd} ${then.latex} \color{unset}
\text{ else } \color{#f5d0fe} ${_else.latex} \color{unset}
\text{ end}
		`;

		return {
			name: cond_value ? 'if-true' : 'if-false',
			premises: [p1, p2],
			conclusion: {
				// source: String.raw`\Braket{ ${formatted_source}, ${sigma_in} } &\rightarrow ${sigma_out}`,
				source: rule(formatted_source, sigma_in, sigma_out),
				// rule: String.raw`\Braket{ ${formatted_rule}, ${sigma_in} } &\rightarrow ${sigma_out}`
				rule: rule(formatted_rule, sigma_in, sigma_out)
			}
		};
	},
	Cmd_seq(c_1, _, c_2) {
		const { var_gen, state } = this.args.stuff as Stuff;

		const sigma_in = state.symbol;

		const [c1, c2] = var_gen.genList(['c', 'c']);
		const p1 = c_1.derivation_tree(this.args.stuff);
		const p2 = c_2.derivation_tree(this.args.stuff);

		const sigma_out = state.symbol;

		const formatted_source = String.raw`
\color{#bae6fd} ${c_1.latex} \color{unset}
\text{ ; }
\color{#f5d0fe} ${c_2.latex} \color{unset}`;

		const formatted_rule = String.raw`
\color{#bae6fd} ${c1} \color{unset}
\text{ ; }
\color{#f5d0fe} ${c2} \color{unset}`;

		return {
			name: this.ctorName,
			premises: [p1, p2],
			conclusion: {
				// source: String.raw`\Braket{ ${formatted_source}, ${sigma_in} } &\rightarrow ${sigma_out}`,
				source: rule(formatted_source, sigma_in, sigma_out),
				// rule: String.raw`\Braket{ \color{#bae6fd} ${c1} \color{unset};\color{#f5d0fe} ${c2} \color{unset}, ${sigma_in} } &\rightarrow ${sigma_out}`
				rule: rule(formatted_rule, sigma_in, sigma_out)
			}
		};
	},
	Cmd_assign(name, _, a_exp) {
		const { var_gen, state } = this.args.stuff as Stuff;

		const sigma_in = state.symbol;
		// in other cases here comes the code that might modify state

		const [a, z] = var_gen.genList(['a', 'z']);

		const p1 = a_exp.derivation_tree({ ...this.args.stuff, out_var: z });

		const var_name = name.sourceString;
		const var_value = a_exp._eval({ vars: { ...state.state }, trace: [] });
		state.assign(var_name, var_value);

		const sigma_out = state.symbol;

		return {
			name: this.ctorName,
			premises: [p1],
			conclusion: {
				// source: String.raw`\Braket{ ${this.sourceString}, ${sigma_in} } &\rightarrow ${sigma_in} [ ${var_name} \mapsto ${var_value} ] =: ${sigma_out}`,
				source: rule(
					this.sourceString,
					sigma_in,
					String.raw`${sigma_in} [ ${var_name} \mapsto ${var_value} ] =: ${sigma_out}`
				),
				// rule: String.raw`\Braket{ ${var_name} := ${a}, ${sigma_in} } &\rightarrow ${sigma_in} [ ${var_name} \mapsto ${z} ] =: ${sigma_out}`
				rule: rule(
					String.raw`${var_name} := ${a}`,
					sigma_in,
					String.raw`${sigma_in} [ ${var_name} \mapsto ${z} ] =: ${sigma_out}`
				)
			}
		};
	},
	Cmd_skip(_) {
		const { state } = this.args.stuff as Stuff;

		const sigma_in = state.symbol;
		// in other cases here comes the code that might modify state
		const sigma_out = state.symbol;

		return {
			name: this.ctorName,
			premises: [],
			conclusion: {
				// source: String.raw`\Braket{ skip, ${sigma_in} } \rightarrow ${sigma_out}`,
				source: rule(this.sourceString, sigma_in, sigma_out),
				// rule: String.raw`\Braket{ skip, ${sigma_in} } \rightarrow ${sigma_out}`
				rule: rule(this.sourceString, sigma_in, sigma_out)
			}
		};
	}
};

const interpret_bool = (_this: NonterminalNode, b_exp: NonterminalNode) => {
	const [a1, operator, a2] = b_exp.children;

	const { var_gen, out_var, state } = _this.args.stuff as Stuff;
	const sigma_in = state.symbol;

	const [a_1, a_2, z_1, z_2] = var_gen.genList(['a', 'a', 'z', 'z']);
	const value = b_exp._eval({ vars: { ...state.state }, trace: [], free_vars: [] });

	let cond = `${z_1} ${operator.latex} ${z_2}`;
	if (!value) cond = `\\neg (${cond})`;

	return {
		name: _this.ctorName,
		premises: [
			a1.derivation_tree({ ..._this.args.stuff, out_var: z_1 }),
			a2.derivation_tree({ ..._this.args.stuff, out_var: z_2 })
		],
		conclusion: {
			source: rule(b_exp.latex, sigma_in, value),
			rule: rule(`${a_1} = ${a_2}`, sigma_in, out_var)
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
		const { state, var_gen, out_var } = this.args.stuff as Stuff;
		const sigma_in = state.symbol;

		const [b] = var_gen.genList(['b']);
		const value = this._eval({ vars: { ...state.state }, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [b_exp.derivation_tree({ ...this.args.stuff, out_var: b })],
			conclusion: {
				source: rule(`\\neg\\ ${b_exp.latex}`, sigma_in, value),
				rule: rule(`\\neg\\ ${b}`, sigma_in, `${value} =: ${out_var}`)
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
	AExp(arg0) {
		const { cmd_only } = this.args.stuff as Stuff;

		if (cmd_only) return undefined;

		return arg0.derivation_tree(this.args.stuff);
	},
	AExp_add(a1, _, a2) {
		const { state, var_gen, out_var } = this.args.stuff as Stuff;
		const sigma_in = state.symbol;

		const [a_1, a_2, z_1, z_2] = var_gen.genList(['a', 'a', 'z', 'z']);
		const value = this._eval({ vars: { ...state.state }, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [
				a1.derivation_tree({ ...this.args.stuff, out_var: z_1 }),
				a2.derivation_tree({ ...this.args.stuff, out_var: z_2 })
			],
			conclusion: {
				source: rule(this.latex, sigma_in, value),
				rule: rule(`${a_1} + ${a_2}`, sigma_in, out_var)
			},
			conditions: [`${out_var} := ${z_1} + ${z_2}`].map(condition)
		};
	},
	AExp_sub(a1, _, a2) {
		const { state, var_gen, out_var } = this.args.stuff as Stuff;
		const sigma_in = state.symbol;

		const [a_1, a_2, z_1, z_2] = var_gen.genList(['a', 'a', 'z', 'z', 'z']);
		const value = this._eval({ vars: { ...state.state }, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [
				a1.derivation_tree({ ...this.args.stuff, out_var: z_1 }),
				a2.derivation_tree({ ...this.args.stuff, out_var: z_2 })
			],
			conclusion: {
				source: rule(this.latex, sigma_in, value),
				rule: rule(`${a_1} - ${a_2}`, sigma_in, out_var)
			},
			conditions: [`${out_var} := ${z_1} - ${z_2}`].map(condition)
		};
	},
	AExp_mul(a1, _, a2) {
		const { state, var_gen, out_var } = this.args.stuff as Stuff;
		const sigma_in = state.symbol;

		const [a_1, a_2, z_1, z_2] = var_gen.genList(['a', 'a', 'z', 'z']);
		const value = this._eval({ vars: { ...state.state }, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [
				a1.derivation_tree({ ...this.args.stuff, out_var: z_1 }),
				a2.derivation_tree({ ...this.args.stuff, out_var: z_2 })
			],
			conclusion: {
				source: rule(this.latex, sigma_in, value),
				rule: rule(`${a_1} * ${a_2}`, sigma_in, out_var)
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
		const { state, out_var } = this.args.stuff as Stuff;
		const sigma_in = state.symbol;

		const value = this._eval({ vars: { ...state.state }, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [],
			conclusion: {
				source: rule(this.latex, sigma_in, value),
				rule: rule(this.latex, sigma_in, `${value} =: ${out_var}`)
			}
		};
	}
};

const number: Partial<WHILEActionDict<Derivation>> = {
	number(arg0) {
		const { state, out_var } = this.args.stuff as Stuff;
		const sigma_in = state.symbol;

		const value = this._eval({ vars: { ...state.state }, trace: [], free_vars: [] });

		return {
			name: this.ctorName,
			premises: [],
			conclusion: {
				source: rule(this.latex, sigma_in, value),
				rule: rule(this.latex, sigma_in, `${value} =: ${out_var}`)
			}
		};
	}
};

const variable: Partial<WHILEActionDict<Derivation>> = {
	var(name) {
		const { out_var, state } = this.args.stuff as Stuff;
		const sigma_in = state.symbol;

		const value = state.value(name.sourceString);

		return {
			name: this.ctorName,
			premises: [],
			conclusion: {
				source: rule(this.latex, sigma_in, `${value}`),
				rule: rule(this.latex, sigma_in, `\\sigma(${this.latex}) =: ${out_var}`)
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
