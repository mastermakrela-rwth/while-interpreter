const program: ABSTRACT_MACHINEActionDict<CompiledAM> = {
	Program(arg0) {
		return arg0.compile(this.args.stuff);
	},
	Program_instruction(instruction) {
		return instruction.compile(this.args.stuff);
	},
	Program_sequence(instruction, program) {
		instruction.compile(this.args.stuff);
		this.args.stuff.line_count++;
		return program.compile(this.args.stuff);
	}
};

const ari_op_check = (config: ExecutionConfiguration) => {
	// stack has at least 2 elements
	if (config.stack.length < 2) throw new Error('[A_op] Stack underflow');

	// top 2 elements are numbers
	const last = config.stack[config.stack.length - 1];
	const second_last = config.stack[config.stack.length - 2];
	if (typeof last !== 'number' || typeof second_last !== 'number')
		throw new Error('[A_op] Top 2 elements of stack are not numbers');
};

const bool_unary_op_check = (config: ExecutionConfiguration) => {
	// stack has at least 1 element
	if (config.stack.length < 1) throw new Error('[B_op] Stack underflow');

	// top element is a boolean
	const last = config.stack[config.stack.length - 1];
	if (typeof last !== 'boolean') throw new Error('[B_op] Top element of stack is not a boolean');
};

const bool_binary_op_check = (config: ExecutionConfiguration) => {
	// stack has at least 2 elements
	if (config.stack.length < 2) throw new Error('[B_op] Stack underflow');

	// top 2 elements are booleans
	const last = config.stack[config.stack.length - 1];
	const second_last = config.stack[config.stack.length - 2];
	if (typeof last !== 'boolean' || typeof second_last !== 'boolean')
		throw new Error('[B_op] Top 2 elements of stack are not booleans');
};

const ari_operations_map = new Map<string, (a: number, b: number) => number>([
	['ADD', (a, b) => a + b],
	['SUB', (a, b) => a - b],
	['MULT', (a, b) => a * b]
]);

const bool_unary_operations_map = new Map<string, (a: boolean) => boolean>([['NOT', (a) => !a]]);

const bool_binary_operations_map = new Map<string, (a: boolean, b: boolean) => boolean>([
	['AND', (a, b) => a && b],
	['OR', (a, b) => a || b]
]);

const mixed_binary_operations_map = new Map<string, (a: number, b: number) => boolean>([
	['EQ', (a, b) => a === b],
	['GT', (a, b) => a > b]
]);

const instructions: ABSTRACT_MACHINEActionDict<CompiledAM> = {
	Instruction_push_number(_, __, number, ___) {
		const stuff = this.args.stuff as CompiledAM;
		const line_number = stuff.line_count;

		const line: CompiledLine = {
			line_number,
			operation: this.sourceString,
			constraints: [
				(config: ExecutionConfiguration) => {
					const _number = Number(number.sourceString);
					if (typeof _number !== 'number') throw new Error('Not a number');
				}
			],
			apply: (config: ExecutionConfiguration) => {
				const _number = Number(number.sourceString);

				return {
					...config,
					stack: [...config.stack, _number],
					program_counter: config.program_counter + 1
				};
			}
		};

		stuff.lines[line_number] = line;

		return this.args.stuff;
	},
	Instruction_push_bool(_, __, boolean, ___) {
		const stuff = this.args.stuff as CompiledAM;

		const line_number = stuff.line_count;

		const line: CompiledLine = {
			line_number,
			operation: this.sourceString,
			constraints: [
				(config: ExecutionConfiguration) => {
					const _boolean = Boolean(boolean.sourceString);
					if (typeof _boolean !== 'boolean') throw new Error('Not a boolean');
				}
			],
			apply: (config: ExecutionConfiguration) => {
				const _boolean = Boolean(boolean.sourceString);
				return {
					...config,
					stack: [...config.stack, _boolean],
					program_counter: config.program_counter + 1
				};
			}
		};

		stuff.lines[line_number] = line;

		return this.args.stuff;
	},
	Instruction_operation(operation) {
		const stuff = this.args.stuff as CompiledAM;

		const line_number = stuff.line_count;

		let line: CompiledLine | undefined = undefined;

		if (['ADD', 'SUB', 'MULT'].includes(operation.sourceString)) {
			const _operation = ari_operations_map.get(operation.sourceString);
			if (!_operation) throw new Error('Operation not found');

			line = {
				line_number,
				operation: this.sourceString,
				constraints: [ari_op_check],
				apply: (config: ExecutionConfiguration) => {
					const a = config.stack.pop() as number;
					const b = config.stack.pop() as number;
					// first b then a because of stack
					const result = _operation(b, a);
					return {
						...config,
						stack: [...config.stack, result],
						program_counter: config.program_counter + 1
					};
				}
			};
		}

		if (['NOT'].includes(operation.sourceString)) {
			const _operation = bool_unary_operations_map.get(operation.sourceString);
			if (!_operation) throw new Error('Operation not found');

			line = {
				line_number,
				operation: this.sourceString,
				constraints: [bool_unary_op_check],
				apply: (config: ExecutionConfiguration) => {
					const a = config.stack.pop() as boolean;
					const result = _operation(a);
					return {
						...config,
						stack: [...config.stack, result],
						program_counter: config.program_counter + 1
					};
				}
			};
		}

		if (['AND', 'OR'].includes(operation.sourceString)) {
			const _operation = bool_binary_operations_map.get(operation.sourceString);
			if (!_operation) throw new Error('Operation not found');

			line = {
				line_number,
				operation: this.sourceString,
				constraints: [bool_binary_op_check],
				apply: (config: ExecutionConfiguration) => {
					const a = config.stack.pop() as boolean;
					const b = config.stack.pop() as boolean;
					// first b then a because of stack
					const result = _operation(b, a);
					return {
						...config,
						stack: [...config.stack, result],
						program_counter: config.program_counter + 1
					};
				}
			};
		}

		if (['EQ', 'GT'].includes(operation.sourceString)) {
			const _operation = mixed_binary_operations_map.get(operation.sourceString);
			if (!_operation) throw new Error('Operation not found');

			line = {
				line_number,
				operation: this.sourceString,
				constraints: [ari_op_check],
				apply: (config: ExecutionConfiguration) => {
					const a = config.stack.pop() as number;
					const b = config.stack.pop() as number;
					// first b then a because of stack
					const result = _operation(b, a);
					return {
						...config,
						stack: [...config.stack, result],
						program_counter: config.program_counter + 1
					};
				}
			};
		}

		if (!line) throw new Error('Operation not found');

		stuff.lines[line_number] = line;

		return this.args.stuff;
	},
	Instruction_load(_, __, variable, ___) {
		const stuff = this.args.stuff as CompiledAM;
		const line_number = stuff.line_count;

		const var_name = variable.sourceString;

		const line: CompiledLine = {
			line_number,
			operation: this.sourceString,
			constraints: [
				(config: ExecutionConfiguration) => {
					if (!(var_name in config.state)) throw new Error(`Variable ${var_name} not found`);
				}
			],
			apply: (config: ExecutionConfiguration) => {
				const value = config.state[var_name];
				return {
					...config,
					stack: [...config.stack, value],
					program_counter: config.program_counter + 1
				};
			}
		};

		stuff.lines[line_number] = line;

		return this.args.stuff;
	},
	Instruction_store(_, __, variable, ___) {
		const stuff = this.args.stuff as CompiledAM;
		const line_number = stuff.line_count;

		const var_name = variable.sourceString;

		const line: CompiledLine = {
			line_number,
			operation: this.sourceString,
			constraints: [
				(config: ExecutionConfiguration) => {
					if (config.stack.length === 0) throw new Error('Stack is empty');
				},
				(config: ExecutionConfiguration) => {
					const value = config.stack[config.stack.length - 1];
					if (typeof value !== 'number') throw new Error('Not a number');
				}
			],
			apply: (config: ExecutionConfiguration) => {
				const value = config.stack.pop() as number;
				return {
					...config,
					state: {
						...config.state,
						[var_name]: value
					},
					program_counter: config.program_counter + 1
				};
			}
		};

		stuff.lines[line_number] = line;

		return this.args.stuff;
	},
	Instruction_jump(_, __, offset, ___) {
		const stuff = this.args.stuff as CompiledAM;
		const line_number = stuff.line_count;

		const line: CompiledLine = {
			line_number,
			operation: this.sourceString,
			constraints: [
				// (config: ExecutionConfiguration) => {
				// 	if (config.stack.length === 0) throw new Error('Stack is empty');
				// },
				// (config: ExecutionConfiguration) => {
				// 	const value = config.stack[config.stack.length - 1];
				// 	if (typeof value !== 'boolean') throw new Error('Not a boolean');
				// },
				// (config: ExecutionConfiguration) => {
				// 	const value = Number(offset.sourceString);
				// 	if (isNaN(value)) throw new Error('Not a number');
				// }
			],
			apply: (config: ExecutionConfiguration) => {
				// const value = config.stack.pop() as boolean;
				const new_pc = Number(offset.sourceString);

				return {
					...config,
					// program_counter: value ? new_pc : config.program_counter + 1
					program_counter: new_pc
				};
			}
		};

		stuff.lines[line_number] = line;

		return this.args.stuff;
	},
	Instruction_jump_if_false(_, __, offset, ___) {
		const stuff = this.args.stuff as CompiledAM;
		const line_number = stuff.line_count;

		const line: CompiledLine = {
			line_number,
			operation: this.sourceString,
			constraints: [
				(config: ExecutionConfiguration) => {
					if (config.stack.length === 0) throw new Error('Stack is empty');
				},
				(config: ExecutionConfiguration) => {
					const value = config.stack[config.stack.length - 1];
					if (typeof value !== 'boolean') throw new Error('Not a boolean');
				},
				(config: ExecutionConfiguration) => {
					const value = Number(offset.sourceString);
					if (isNaN(value)) throw new Error('Not a number');
				}
			],
			apply: (config: ExecutionConfiguration) => {
				const value = config.stack.pop() as boolean;
				const new_pc = Number(offset.sourceString);

				return {
					...config,
					program_counter: !value ? new_pc : config.program_counter + 1
				};
			}
		};

		stuff.lines[line_number] = line;

		return this.args.stuff;
	}
};

const compile_semantics: SemanticsOperationAM<CompiledAM> = {
	name: 'compile(stuff)',
	actions: {
		Start(program) {
			if (!this.args.stuff) {
				this.args.stuff = { line_count: 1, lines: [] };
			}

			program.compile(this.args.stuff);

			return this.args.stuff;
		},
		...program,
		...instructions
	}
};

export const compile_operations = [compile_semantics];
