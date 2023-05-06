const program: Partial<WHILEActionDict<string>> = {
	Cmd_while(_, cond, __, body, ___) {
		return String.raw`\text{while } ${cond.latex} \text{ do } ${body.latex} \text{ end}`;
	},
	Cmd_if(_, cond, __, then, ___, _else, ____) {
		return String.raw`\text{if } ${cond.latex} \text{ then } ${then.latex} \text{ else } ${_else.latex} \text{ end}`;
	}
};

const arithmetic_exp: Partial<WHILEActionDict<string>> = {
	AExp(a_exp) {
		if (a_exp.numChildren !== 3) {
			return a_exp.latex;
		}

		const [left, op, right] = a_exp.children;

		return `${left.latex} ${op.sourceString} ${right.latex}`;
	}
};

const operator_to_tex = new Map<string, string>([
	['=', '='],
	['!=', '\\neq'],
	['<', '<'],
	['<=', '\\leq'],
	['>', '>'],
	['>=', '\\geq'],
	['&&', '\\land'],
	['||', '\\lor'],
	['!', '\\neg']
]);

const latex_semantics: SemanticsOperation<string> = {
	name: 'latex',
	actions: {
		...program,
		...arithmetic_exp,
		_nonterminal(...children) {
			let separator = '';
			if (this.ctorName.includes('BExp_')) {
				separator = ' ';
			}

			return children.map((c) => c.latex).join(separator);
		},
		_terminal() {
			const tex = operator_to_tex.get(this.sourceString);

			return tex ?? this.sourceString;
		},
		var(name) {
			return this.sourceString;
		},
		number(n) {
			return this.sourceString;
		},
		bool(b) {
			return this.sourceString;
		}
	}
};

export const latex_attributes = [latex_semantics];
