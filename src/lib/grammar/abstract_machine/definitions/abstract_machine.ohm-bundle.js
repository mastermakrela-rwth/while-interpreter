import { makeRecipe } from 'ohm-js';
const result = makeRecipe([
	'grammar',
	{
		source:
			'ABSTRACT_MACHINE {\n\tProgram = Instruction ";" Program \t-- sequence\n\t\t| Instruction\t\t\t\t\t-- instruction\n\n\tInstruction\n\t\t= "PUSH" "(" number ")"\t-- push_number\n\t\t| "PUSH" "(" bool ")"\t-- push_bool\n\t\t| "ADD"\t\t \t\t\t-- add\n\t\t| "SUB" \t\t\t\t-- sub\n\t\t| "MULT" \t\t\t\t-- mult\n\t\t| "EQ" \t\t\t\t\t-- eq\n\t\t| "GT" \t\t\t\t\t-- gt\n\t\t| "NOT" \t\t\t\t-- not\n\t\t| "AND" \t\t\t\t-- and\n\t\t| "OR" \t\t\t\t\t-- or\n\t\t| "LOAD" "(" var ")" \t-- load\n\t\t| "STO" "(" var ")" \t-- store\n\t\t| "JMP" "(" number ")" \t-- jump\n\t\t| "JMPF" "(" number ")"\t-- jump_if_false\n\n\tbool (a bool value)\n\t\t= "true" ~var\n\t\t| "false" ~var\n\n\tvar  (a variable)\n\t\t= letter+\n\n\tnumber\t(positive and negative integers)\n\t\t= "-" digit+\t-- negative\n\t\t| digit+\t\t-- positive\n}'
	},
	'ABSTRACT_MACHINE',
	null,
	'Program',
	{
		Program_sequence: [
			'define',
			{ sourceInterval: [30, 66] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [30, 53] },
				['app', { sourceInterval: [30, 41] }, 'Instruction', []],
				['terminal', { sourceInterval: [42, 45] }, ';'],
				['app', { sourceInterval: [46, 53] }, 'Program', []]
			]
		],
		Program_instruction: [
			'define',
			{ sourceInterval: [71, 101] },
			null,
			[],
			['app', { sourceInterval: [71, 82] }, 'Instruction', []]
		],
		Program: [
			'define',
			{ sourceInterval: [20, 101] },
			null,
			[],
			[
				'alt',
				{ sourceInterval: [30, 101] },
				['app', { sourceInterval: [30, 53] }, 'Program_sequence', []],
				['app', { sourceInterval: [71, 82] }, 'Program_instruction', []]
			]
		],
		Instruction_push_number: [
			'define',
			{ sourceInterval: [120, 156] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [120, 141] },
				['terminal', { sourceInterval: [120, 126] }, 'PUSH'],
				['terminal', { sourceInterval: [127, 130] }, '('],
				['app', { sourceInterval: [131, 137] }, 'number', []],
				['terminal', { sourceInterval: [138, 141] }, ')']
			]
		],
		Instruction_push_bool: [
			'define',
			{ sourceInterval: [161, 193] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [161, 180] },
				['terminal', { sourceInterval: [161, 167] }, 'PUSH'],
				['terminal', { sourceInterval: [168, 171] }, '('],
				['app', { sourceInterval: [172, 176] }, 'bool', []],
				['terminal', { sourceInterval: [177, 180] }, ')']
			]
		],
		Instruction_add: [
			'define',
			{ sourceInterval: [198, 215] },
			null,
			[],
			['terminal', { sourceInterval: [198, 203] }, 'ADD']
		],
		Instruction_sub: [
			'define',
			{ sourceInterval: [220, 236] },
			null,
			[],
			['terminal', { sourceInterval: [220, 225] }, 'SUB']
		],
		Instruction_mult: [
			'define',
			{ sourceInterval: [241, 259] },
			null,
			[],
			['terminal', { sourceInterval: [241, 247] }, 'MULT']
		],
		Instruction_eq: [
			'define',
			{ sourceInterval: [264, 279] },
			null,
			[],
			['terminal', { sourceInterval: [264, 268] }, 'EQ']
		],
		Instruction_gt: [
			'define',
			{ sourceInterval: [284, 299] },
			null,
			[],
			['terminal', { sourceInterval: [284, 288] }, 'GT']
		],
		Instruction_not: [
			'define',
			{ sourceInterval: [304, 320] },
			null,
			[],
			['terminal', { sourceInterval: [304, 309] }, 'NOT']
		],
		Instruction_and: [
			'define',
			{ sourceInterval: [325, 341] },
			null,
			[],
			['terminal', { sourceInterval: [325, 330] }, 'AND']
		],
		Instruction_or: [
			'define',
			{ sourceInterval: [346, 361] },
			null,
			[],
			['terminal', { sourceInterval: [346, 350] }, 'OR']
		],
		Instruction_load: [
			'define',
			{ sourceInterval: [366, 393] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [366, 384] },
				['terminal', { sourceInterval: [366, 372] }, 'LOAD'],
				['terminal', { sourceInterval: [373, 376] }, '('],
				['app', { sourceInterval: [377, 380] }, 'var', []],
				['terminal', { sourceInterval: [381, 384] }, ')']
			]
		],
		Instruction_store: [
			'define',
			{ sourceInterval: [398, 425] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [398, 415] },
				['terminal', { sourceInterval: [398, 403] }, 'STO'],
				['terminal', { sourceInterval: [404, 407] }, '('],
				['app', { sourceInterval: [408, 411] }, 'var', []],
				['terminal', { sourceInterval: [412, 415] }, ')']
			]
		],
		Instruction_jump: [
			'define',
			{ sourceInterval: [430, 459] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [430, 450] },
				['terminal', { sourceInterval: [430, 435] }, 'JMP'],
				['terminal', { sourceInterval: [436, 439] }, '('],
				['app', { sourceInterval: [440, 446] }, 'number', []],
				['terminal', { sourceInterval: [447, 450] }, ')']
			]
		],
		Instruction_jump_if_false: [
			'define',
			{ sourceInterval: [464, 502] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [464, 485] },
				['terminal', { sourceInterval: [464, 470] }, 'JMPF'],
				['terminal', { sourceInterval: [471, 474] }, '('],
				['app', { sourceInterval: [475, 481] }, 'number', []],
				['terminal', { sourceInterval: [482, 485] }, ')']
			]
		],
		Instruction: [
			'define',
			{ sourceInterval: [104, 502] },
			null,
			[],
			[
				'alt',
				{ sourceInterval: [120, 502] },
				['app', { sourceInterval: [120, 141] }, 'Instruction_push_number', []],
				['app', { sourceInterval: [161, 180] }, 'Instruction_push_bool', []],
				['app', { sourceInterval: [198, 203] }, 'Instruction_add', []],
				['app', { sourceInterval: [220, 225] }, 'Instruction_sub', []],
				['app', { sourceInterval: [241, 247] }, 'Instruction_mult', []],
				['app', { sourceInterval: [264, 268] }, 'Instruction_eq', []],
				['app', { sourceInterval: [284, 288] }, 'Instruction_gt', []],
				['app', { sourceInterval: [304, 309] }, 'Instruction_not', []],
				['app', { sourceInterval: [325, 330] }, 'Instruction_and', []],
				['app', { sourceInterval: [346, 350] }, 'Instruction_or', []],
				['app', { sourceInterval: [366, 384] }, 'Instruction_load', []],
				['app', { sourceInterval: [398, 415] }, 'Instruction_store', []],
				['app', { sourceInterval: [430, 450] }, 'Instruction_jump', []],
				['app', { sourceInterval: [464, 485] }, 'Instruction_jump_if_false', []]
			]
		],
		bool: [
			'define',
			{ sourceInterval: [505, 557] },
			'a bool value',
			[],
			[
				'alt',
				{ sourceInterval: [529, 557] },
				[
					'seq',
					{ sourceInterval: [529, 540] },
					['terminal', { sourceInterval: [529, 535] }, 'true'],
					[
						'not',
						{ sourceInterval: [536, 540] },
						['app', { sourceInterval: [537, 540] }, 'var', []]
					]
				],
				[
					'seq',
					{ sourceInterval: [545, 557] },
					['terminal', { sourceInterval: [545, 552] }, 'false'],
					[
						'not',
						{ sourceInterval: [553, 557] },
						['app', { sourceInterval: [554, 557] }, 'var', []]
					]
				]
			]
		],
		var: [
			'define',
			{ sourceInterval: [560, 589] },
			'a variable',
			[],
			[
				'plus',
				{ sourceInterval: [582, 589] },
				['app', { sourceInterval: [582, 588] }, 'letter', []]
			]
		],
		number_negative: [
			'define',
			{ sourceInterval: [636, 658] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [636, 646] },
				['terminal', { sourceInterval: [636, 639] }, '-'],
				[
					'plus',
					{ sourceInterval: [640, 646] },
					['app', { sourceInterval: [640, 645] }, 'digit', []]
				]
			]
		],
		number_positive: [
			'define',
			{ sourceInterval: [663, 682] },
			null,
			[],
			['plus', { sourceInterval: [663, 669] }, ['app', { sourceInterval: [663, 668] }, 'digit', []]]
		],
		number: [
			'define',
			{ sourceInterval: [592, 682] },
			'positive and negative integers',
			[],
			[
				'alt',
				{ sourceInterval: [636, 682] },
				['app', { sourceInterval: [636, 646] }, 'number_negative', []],
				['app', { sourceInterval: [663, 669] }, 'number_positive', []]
			]
		]
	}
]);
export default result;
