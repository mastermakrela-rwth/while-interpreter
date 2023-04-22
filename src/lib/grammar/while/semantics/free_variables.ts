type Stuff = {
	already_assigned: string[];
};

const cmd: Partial<WHILEActionDict<string[]>> = {
	Cmd_seq(c1, _, c2) {
		const frees1 = c1.free_vars(this.args.stuff) as string[];

		const frees2 = c2.free_vars(this.args.stuff) as string[];

		return [...frees1, ...frees2];
	},
	Cmd_if(_, cond, __, then, ___, _else, ____) {
		const { already_assigned } = this.args.stuff as Stuff;

		const frees1 = cond.free_vars(this.args.stuff);

		const frees2 = then.free_vars({ already_assigned: [...already_assigned] });

		const frees3 = _else.free_vars({ already_assigned: [...already_assigned] });

		return [...frees1, ...frees2, ...frees3];
	},
	// Cmd_while(_, cond, __, body, ___) {
	// it works automatically here because our fallback just goes through
	// all the children (cond, body), which is exactly what we want
	// in pure math one would need a real rule for this
	// },
	Cmd_assign(name, _, expr) {
		const { already_assigned } = this.args.stuff as Stuff;

		const exp_free_vars = expr.free_vars(this.args.stuff) as string[];

		already_assigned.push(name.sourceString);

		return exp_free_vars;
	}
};

const variable: Partial<WHILEActionDict<string[]>> = {
	var(name) {
		const { already_assigned } = this.args.stuff as Stuff;

		if (already_assigned.includes(name.sourceString)) return [];

		return [name.sourceString];
	}
};

const free_vars_semantics: SemanticsOperation<string[]> = {
	name: 'free_vars(stuff)',
	actions: {
		Program(arg0) {
			return arg0.free_vars({ already_assigned: [] });
		},
		...cmd,
		...variable,
		_nonterminal(...children) {
			return children.reduce<string[]>((acc, child) => {
				return [...acc, ...child.free_vars(this.args.stuff)];
			}, []);
		},
		bool(_) {
			return [];
		},
		number(_) {
			return [];
		},
		// this catches all symbols, that obviously don't have free variables
		_terminal() {
			return [];
		}
	}
};

export const free_variables_operations = [free_vars_semantics];
