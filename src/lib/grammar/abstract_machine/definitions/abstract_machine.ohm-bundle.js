import { makeRecipe } from 'ohm-js';
const result = makeRecipe([
	'grammar',
	{
		source:
			'ABSTRACT_MACHINE {\n\tStart\n\t\t= Program\n\n\tProgram = Instruction Program \t-- sequence\n\t\t| Instruction\t\t\t\t-- instruction\n\n\tInstruction\n\t\t= "PUSH" "(" number ")"\t-- push_number\n\t\t| "PUSH" "(" bool ")"\t-- push_bool\n\t\t| operation\t\t\t\t-- operation\n\t\t| "LOAD" "(" var ")" \t-- load\n\t\t| "STO" "(" var ")" \t-- store\n\t\t| "JMP" "(" number ")" \t-- jump\n\t\t| "JMPF" "(" number ")"\t-- jump_if_false\n\n\toperation\n\t\t= "ADD"\t\t-- add\n\t\t| "SUB" \t-- sub\n\t\t| "MULT" \t-- mult\n\t\t| "EQ" \t\t-- eq\n\t\t| "GT" \t\t-- gt\n\t\t| "NOT" \t-- not\n\t\t| "AND" \t-- and\n\t\t| "OR" \t\t-- or\n\n\tbool (a bool value)\n\t\t= "true" ~var\n\t\t| "false" ~var\n\n\tvar  (a variable)\n\t\t= letter+\n\n\tnumber\t(positive and negative integers)\n\t\t= "-" digit+\t-- negative\n\t\t| digit+\t\t-- positive\n\n\tcomment = "/*" (~"*/" any)* "*/"\n\tspace += comment\n}'
	},
	'ABSTRACT_MACHINE',
	null,
	'Start',
	{
		Start: [
			'define',
			{ sourceInterval: [20, 37] },
			null,
			[],
			['app', { sourceInterval: [30, 37] }, 'Program', []]
		],
		Program_sequence: [
			'define',
			{ sourceInterval: [50, 82] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [50, 69] },
				['app', { sourceInterval: [50, 61] }, 'Instruction', []],
				['app', { sourceInterval: [62, 69] }, 'Program', []]
			]
		],
		Program_instruction: [
			'define',
			{ sourceInterval: [87, 116] },
			null,
			[],
			['app', { sourceInterval: [87, 98] }, 'Instruction', []]
		],
		Program: [
			'define',
			{ sourceInterval: [40, 116] },
			null,
			[],
			[
				'alt',
				{ sourceInterval: [50, 116] },
				['app', { sourceInterval: [50, 69] }, 'Program_sequence', []],
				['app', { sourceInterval: [87, 98] }, 'Program_instruction', []]
			]
		],
		Instruction_push_number: [
			'define',
			{ sourceInterval: [135, 171] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [135, 156] },
				['terminal', { sourceInterval: [135, 141] }, 'PUSH'],
				['terminal', { sourceInterval: [142, 145] }, '('],
				['app', { sourceInterval: [146, 152] }, 'number', []],
				['terminal', { sourceInterval: [153, 156] }, ')']
			]
		],
		Instruction_push_bool: [
			'define',
			{ sourceInterval: [176, 208] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [176, 195] },
				['terminal', { sourceInterval: [176, 182] }, 'PUSH'],
				['terminal', { sourceInterval: [183, 186] }, '('],
				['app', { sourceInterval: [187, 191] }, 'bool', []],
				['terminal', { sourceInterval: [192, 195] }, ')']
			]
		],
		Instruction_operation: [
			'define',
			{ sourceInterval: [213, 238] },
			null,
			[],
			['app', { sourceInterval: [213, 222] }, 'operation', []]
		],
		Instruction_load: [
			'define',
			{ sourceInterval: [243, 270] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [243, 261] },
				['terminal', { sourceInterval: [243, 249] }, 'LOAD'],
				['terminal', { sourceInterval: [250, 253] }, '('],
				['app', { sourceInterval: [254, 257] }, 'var', []],
				['terminal', { sourceInterval: [258, 261] }, ')']
			]
		],
		Instruction_store: [
			'define',
			{ sourceInterval: [275, 302] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [275, 292] },
				['terminal', { sourceInterval: [275, 280] }, 'STO'],
				['terminal', { sourceInterval: [281, 284] }, '('],
				['app', { sourceInterval: [285, 288] }, 'var', []],
				['terminal', { sourceInterval: [289, 292] }, ')']
			]
		],
		Instruction_jump: [
			'define',
			{ sourceInterval: [307, 336] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [307, 327] },
				['terminal', { sourceInterval: [307, 312] }, 'JMP'],
				['terminal', { sourceInterval: [313, 316] }, '('],
				['app', { sourceInterval: [317, 323] }, 'number', []],
				['terminal', { sourceInterval: [324, 327] }, ')']
			]
		],
		Instruction_jump_if_false: [
			'define',
			{ sourceInterval: [341, 379] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [341, 362] },
				['terminal', { sourceInterval: [341, 347] }, 'JMPF'],
				['terminal', { sourceInterval: [348, 351] }, '('],
				['app', { sourceInterval: [352, 358] }, 'number', []],
				['terminal', { sourceInterval: [359, 362] }, ')']
			]
		],
		Instruction: [
			'define',
			{ sourceInterval: [119, 379] },
			null,
			[],
			[
				'alt',
				{ sourceInterval: [135, 379] },
				['app', { sourceInterval: [135, 156] }, 'Instruction_push_number', []],
				['app', { sourceInterval: [176, 195] }, 'Instruction_push_bool', []],
				['app', { sourceInterval: [213, 222] }, 'Instruction_operation', []],
				['app', { sourceInterval: [243, 261] }, 'Instruction_load', []],
				['app', { sourceInterval: [275, 292] }, 'Instruction_store', []],
				['app', { sourceInterval: [307, 327] }, 'Instruction_jump', []],
				['app', { sourceInterval: [341, 362] }, 'Instruction_jump_if_false', []]
			]
		],
		operation_add: [
			'define',
			{ sourceInterval: [396, 409] },
			null,
			[],
			['terminal', { sourceInterval: [396, 401] }, 'ADD']
		],
		operation_sub: [
			'define',
			{ sourceInterval: [414, 427] },
			null,
			[],
			['terminal', { sourceInterval: [414, 419] }, 'SUB']
		],
		operation_mult: [
			'define',
			{ sourceInterval: [432, 447] },
			null,
			[],
			['terminal', { sourceInterval: [432, 438] }, 'MULT']
		],
		operation_eq: [
			'define',
			{ sourceInterval: [452, 464] },
			null,
			[],
			['terminal', { sourceInterval: [452, 456] }, 'EQ']
		],
		operation_gt: [
			'define',
			{ sourceInterval: [469, 481] },
			null,
			[],
			['terminal', { sourceInterval: [469, 473] }, 'GT']
		],
		operation_not: [
			'define',
			{ sourceInterval: [486, 499] },
			null,
			[],
			['terminal', { sourceInterval: [486, 491] }, 'NOT']
		],
		operation_and: [
			'define',
			{ sourceInterval: [504, 517] },
			null,
			[],
			['terminal', { sourceInterval: [504, 509] }, 'AND']
		],
		operation_or: [
			'define',
			{ sourceInterval: [522, 534] },
			null,
			[],
			['terminal', { sourceInterval: [522, 526] }, 'OR']
		],
		operation: [
			'define',
			{ sourceInterval: [382, 534] },
			null,
			[],
			[
				'alt',
				{ sourceInterval: [396, 534] },
				['app', { sourceInterval: [396, 401] }, 'operation_add', []],
				['app', { sourceInterval: [414, 419] }, 'operation_sub', []],
				['app', { sourceInterval: [432, 438] }, 'operation_mult', []],
				['app', { sourceInterval: [452, 456] }, 'operation_eq', []],
				['app', { sourceInterval: [469, 473] }, 'operation_gt', []],
				['app', { sourceInterval: [486, 491] }, 'operation_not', []],
				['app', { sourceInterval: [504, 509] }, 'operation_and', []],
				['app', { sourceInterval: [522, 526] }, 'operation_or', []]
			]
		],
		bool: [
			'define',
			{ sourceInterval: [537, 589] },
			'a bool value',
			[],
			[
				'alt',
				{ sourceInterval: [561, 589] },
				[
					'seq',
					{ sourceInterval: [561, 572] },
					['terminal', { sourceInterval: [561, 567] }, 'true'],
					[
						'not',
						{ sourceInterval: [568, 572] },
						['app', { sourceInterval: [569, 572] }, 'var', []]
					]
				],
				[
					'seq',
					{ sourceInterval: [577, 589] },
					['terminal', { sourceInterval: [577, 584] }, 'false'],
					[
						'not',
						{ sourceInterval: [585, 589] },
						['app', { sourceInterval: [586, 589] }, 'var', []]
					]
				]
			]
		],
		var: [
			'define',
			{ sourceInterval: [592, 621] },
			'a variable',
			[],
			[
				'plus',
				{ sourceInterval: [614, 621] },
				['app', { sourceInterval: [614, 620] }, 'letter', []]
			]
		],
		number_negative: [
			'define',
			{ sourceInterval: [668, 690] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [668, 678] },
				['terminal', { sourceInterval: [668, 671] }, '-'],
				[
					'plus',
					{ sourceInterval: [672, 678] },
					['app', { sourceInterval: [672, 677] }, 'digit', []]
				]
			]
		],
		number_positive: [
			'define',
			{ sourceInterval: [695, 714] },
			null,
			[],
			['plus', { sourceInterval: [695, 701] }, ['app', { sourceInterval: [695, 700] }, 'digit', []]]
		],
		number: [
			'define',
			{ sourceInterval: [624, 714] },
			'positive and negative integers',
			[],
			[
				'alt',
				{ sourceInterval: [668, 714] },
				['app', { sourceInterval: [668, 678] }, 'number_negative', []],
				['app', { sourceInterval: [695, 701] }, 'number_positive', []]
			]
		],
		comment: [
			'define',
			{ sourceInterval: [717, 749] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [727, 749] },
				['terminal', { sourceInterval: [727, 731] }, '/*'],
				[
					'star',
					{ sourceInterval: [732, 744] },
					[
						'seq',
						{ sourceInterval: [733, 742] },
						[
							'not',
							{ sourceInterval: [733, 738] },
							['terminal', { sourceInterval: [734, 738] }, '*/']
						],
						['app', { sourceInterval: [739, 742] }, 'any', []]
					]
				],
				['terminal', { sourceInterval: [745, 749] }, '*/']
			]
		],
		space: [
			'extend',
			{ sourceInterval: [751, 767] },
			null,
			[],
			['app', { sourceInterval: [760, 767] }, 'comment', []]
		]
	}
]);
export default result;
