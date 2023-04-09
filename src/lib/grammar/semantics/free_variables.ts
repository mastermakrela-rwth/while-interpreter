type Stuff = {
	vars: string[];
	assignments: string[];
};

// TODO: take eval and mod it a bit (the easy^tm way didn't work out)
const free_variables_semantics: SemanticsOperation<Stuff> = {
	name: '_free_variables()',
	actions: {
		// Program(arg0) {
		// 	const { vars, assignments } = arg0._free_variables() as Stuff;
		// 	console.log(
		// 		'🚀 ~ file: free_variables.ts:13 ~ Program ~ vars, assignments:',
		// 		new Set(vars),
		// 		new Set(assignments)
		// 	);

		// 	// get set difference
		// 	const free_variables = vars.filter((v) => !assignments.includes(v));
		// 	console.log('🚀 ~ file: free_variables.ts:16 ~ Program ~ free_variables:', free_variables);

		// 	return { vars: [], assignments: [] };
		// },
		// _nonterminal(...children) {
		// 	return children.reduce<Stuff>(
		// 		(acc, child) => {
		// 			const { vars, assignments } = child._free_variables();
		// 			return {
		// 				vars: [...acc.vars, ...vars],
		// 				assignments: [...acc.assignments, ...assignments]
		// 			};
		// 		},
		// 		{ vars: [], assignments: [] }
		// 	);
		// },
		// _iter(...children) {
		// 	return children.reduce<Stuff>(
		// 		(acc, child) => {
		// 			const { vars, assignments } = child._free_variables();
		// 			return {
		// 				vars: [...acc.vars, ...vars],
		// 				assignments: [...acc.assignments, ...assignments]
		// 			};
		// 		},
		// 		{ vars: [], assignments: [] }
		// 	);
		// },
		// Cmd_assign(arg0, arg1, arg2) {
		// 	const free_variables = arg2._free_variables() as Stuff;
		// 	console.log('🚀 ~ file: free_variables.ts:56 ~ Cmd_assign ~ free_variables:', free_variables);

		// 	return {
		// 		vars: free_variables.vars,
		// 		assignments: [...free_variables.assignments, arg0.sourceString]
		// 	};
		// },
		// var(arg0) {
		// 	return {
		// 		vars: [arg0.sourceString],
		// 		assignments: []
		// 	};
		// },
		// _terminal() {
		// 	return { vars: [], assignments: [] };
		// },

		Program(arg0) {
			return { vars: [], assignments: [] };
		}
	}
};

export const free_variables_operations = [free_variables_semantics];
