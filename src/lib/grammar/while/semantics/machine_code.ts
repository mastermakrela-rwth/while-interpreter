type State = {
	program: Program;
};

class Program {
	private lines: string[] = [];
	private comments: string[][] = [];

	get length() {
		return this.lines.length;
	}

	toString(line_numbers = true, comments = true) {
		const longest = this.lines.reduce((a, b) => (a.length > b.length ? a : b)).length;

		return this.lines
			.map((line, i) => {
				if (line === '') return '';

				let _line = line;

				const tab_count = Math.ceil((longest - line.length) / 3) + 1;
				_line += '\t'.repeat(tab_count);

				if (line_numbers) {
					_line += `# (Line ${i + 1})`;
				}

				if (comments && this.comments[i]) {
					_line += `\t${this.comments[i].join('\t')}`;
				}

				return _line;
			})
			.join('\n');
	}

	addLine(line: string) {
		this.lines.push(line);
	}

	updateLine(line: number, new_line: string) {
		this.lines[line] = new_line;
	}

	addComment(line: number, comment: string) {
		if (!this.comments[line]) this.comments[line] = [];
		this.comments[line].push(comment);
	}
}

const cmd: Partial<WHILEActionDict<MachineCode>> = {
	Cmd_seq(cmd1, _, cmd2) {
		const { program } = this.args.state as State;

		// program.addComment(program.length, `[S][seq] ${this.sourceString.replaceAll('\n', '\t')}`);

		cmd1.machine_code(this.args.state);

		cmd2.machine_code(this.args.state);

		// program.addComment(program.length - 1, `[E][seq] ${this.sourceString.replaceAll('\n', '\t')}`);

		return program.toString();
	},
	Cmd_if(_, b_exp, __, cmd1, ___, cmd2, ____) {
		const { program } = this.args.state as State;

		program.addComment(program.length, `[S][if] ${this.sourceString.replaceAll('\n', ' ')}`);

		b_exp.machine_code(this.args.state);

		program.addLine(`JMPF( @1@ )`);
		const jmp_line_nr = program.length - 1;

		cmd1.machine_code(this.args.state);

		program.addLine(`JMP( @2@ )`);
		const jmp2_line_nr = program.length - 1;

		program.updateLine(jmp_line_nr, `JMPF( ${program.length + 1} )`);

		cmd2.machine_code(this.args.state);

		program.updateLine(jmp2_line_nr, `JMP( ${program.length + 1} )`);

		program.addComment(program.length - 1, `[E][if] ${this.sourceString.replaceAll('\n', ' ')}`);

		return program.toString();
	},
	Cmd_while(_, b_exp, __, cmd, ___) {
		const { program } = this.args.state as State;

		program.addComment(program.length, `[S][while] ${this.sourceString.replaceAll('\n', ' ')}`);

		const start_line = program.length + 1;

		b_exp.machine_code(this.args.state);

		program.addLine(`JMPF( @1@ )`);
		const jmp_line_nr = program.length - 1;

		cmd.machine_code(this.args.state);

		program.addLine(`JMP( ${start_line} )`);

		program.updateLine(jmp_line_nr, `JMPF( ${program.length + 1} )`);

		program.addComment(program.length - 1, `[E][while] ${this.sourceString.replaceAll('\n', ' ')}`);

		return program.toString();
	},
	Cmd_assign(name, _, expr) {
		const { program } = this.args.state as State;

		program.addComment(program.length, `[S][assign] ${this.sourceString}`);

		expr.machine_code(this.args.state);

		program.addLine(`STO( ${name.sourceString} )`);

		program.addComment(program.length - 1, `[E][assign] ${this.sourceString}`);

		return program.toString();
	},
	Cmd_skip(_) {
		return '';
	}
};

const boolean_op_key: Record<string, [string, string]> = {
	'&&': ['and', 'AND'],
	'||': ['or', 'OR'],
	'!': ['not', 'NOT'],
	'=': ['eq', 'EQ'],
	'>': ['gt', 'GT'],
	// TODO: replace with variants of ">"
	'<': ['lt', 'LT'],
	'>=': ['geq', 'GEQ'],
	'<=': ['leq', 'LEQ']
};

const boolean_exp: Partial<WHILEActionDict<MachineCode>> = {
	BExp(b_exp) {
		if (b_exp.numChildren !== 3) {
			return b_exp.machine_code(this.args.state);
		}

		const { program } = this.args.state as State;
		const [b1, op, b2] = b_exp.children;
		const [name, instruction] = boolean_op_key[op.sourceString];

		program.addComment(program.length, `[S][${name}] ${b_exp.sourceString}`);

		b1.machine_code(this.args.state);
		b2.machine_code(this.args.state);

		program.addLine(instruction);

		program.addComment(program.length, `[E][${name}] ${b_exp.sourceString}`);

		return program.toString();
	},
	BExp_not(_, b_exp) {
		const { program } = this.args.state as State;

		program.addComment(program.length, `[S][not] ${b_exp.sourceString}`);

		b_exp.machine_code(this.args.state);
		program.addLine('NOT');

		program.addComment(program.length - 1, `[S][not] ${b_exp.sourceString}`);

		return program.toString();
	},
	PriBExp(b_exp) {
		if (b_exp.numChildren !== 3) {
			return b_exp.machine_code(this.args.state);
		}

		const [b1, op, b2] = b_exp.children;

		// CASE: parenthesis
		if (b1.isTerminal() && b2.isTerminal()) {
			return op.machine_code(this.args.state);
		}

		const { program } = this.args.state as State;
		const [name, instruction] = boolean_op_key[op.sourceString];

		program.addComment(program.length, `[S][${name}] ${b_exp.sourceString}`);

		b1.machine_code(this.args.state);
		b2.machine_code(this.args.state);

		program.addLine(instruction);

		program.addComment(program.length - 1, `[E][${name}] ${b_exp.sourceString}`);

		return program.toString();
	}
};

const arithmetic_op_key: Record<string, [string, string]> = {
	'+': ['add', 'ADD'],
	'-': ['sub', 'SUB'],
	'*': ['mul', 'MULT']
};

const arithmetic_exp: Partial<WHILEActionDict<MachineCode>> = {
	AExp(a_exp) {
		if (a_exp.numChildren !== 3) {
			return a_exp.machine_code(this.args.state);
		}

		const { program } = this.args.state as State;
		const [a1, op, a2] = a_exp.children;
		const [name, instruction] = arithmetic_op_key[op.sourceString];

		program.addComment(program.length, `[S][${name}] ${a_exp.sourceString}`);

		a1.machine_code(this.args.state);
		a2.machine_code(this.args.state);

		program.addLine(instruction);

		program.addComment(program.length - 1, `[E][${name}] ${a_exp.sourceString}`);

		return program.toString();
	},
	PriAExp_paren(_, a_exp, __) {
		return a_exp.machine_code(this.args.state);
	}
};

const bool: Partial<WHILEActionDict<MachineCode>> = {
	bool(arg0) {
		const { program } = this.args.state as State;
		program.addLine(`PUSH( ${arg0.sourceString} )`);
		return program.toString();
	}
};

const number: Partial<WHILEActionDict<MachineCode>> = {
	number(arg0) {
		const { program } = this.args.state as State;
		program.addLine(`PUSH( ${arg0.sourceString} )`);
		return program.toString();
	}
};

const variable: Partial<WHILEActionDict<MachineCode>> = {
	var(arg0) {
		const { program } = this.args.state as State;
		program.addLine(`LOAD( ${arg0.sourceString} )`);
		return program.toString();
	}
};

const machine_code_semantics: SemanticsOperation<MachineCode> = {
	name: 'machine_code(state)',
	actions: {
		Program(cmd) {
			const state: State = {
				program: new Program()
			};

			const code = cmd.machine_code(state);

			console.assert(code === state.program.toString(), "codes don't match");

			return state.program.toString();
		},
		...cmd,
		...boolean_exp,
		...arithmetic_exp,
		...bool,
		...number,
		...variable
	}
};

export const machine_code_operations = [machine_code_semantics];
