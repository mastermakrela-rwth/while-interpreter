import { makeRecipe } from 'ohm-js';
const result = makeRecipe([
	'grammar',
	{
		source:
			'WHILE {\n\tProgram = Cmd | BExp | AExp\n\n\tCmd\t(commands / statements)\n\t\t= Cmd ";" Cmd\t\t\t\t\t\t\t-- seq\n\t\t| "if" BExp "then" Cmd "else" Cmd "end"\t-- if\n\t\t| "while" BExp "do" Cmd "end"\t\t\t-- while\n\t\t| var ":=" AExp\t\t\t\t\t\t\t-- assign\n\t\t| "skip"\t\t\t\t\t\t\t\t-- skip\n\n\tBExp\n\t\t= BExp "&&" BExp\t-- and\n\t\t| BExp "||" BExp\t-- or\n        | "!" PriBExp\t\t-- not\n        | PriBExp\n\n\tPriBExp\n\t\t= "(" BExp ")"\t\t-- paren\n\t\t| "&&" PriBExp\t\t-- and\n\t\t| "||" PriBExp\t\t-- or\n\t\t| AExp "=" AExp\t\t-- eq\n\t\t| AExp ">" AExp\t\t-- gt\n\t\t| AExp "<" AExp\t\t-- lt\n\t\t| AExp ">=" AExp\t-- geq\n\t\t| AExp "<=" AExp\t-- leq\n\t\t| bool\n\n\tAExp (arithmetic expressions)\n\t\t= AExp "+" AExp\t\t-- add\n\t\t| AExp "-" AExp\t\t-- sub\n\t\t| AExp "*" PriAExp\t-- mul\n\t\t| PriAExp\n\n\tPriAExp\n\t\t= "(" AExp ")"\t\t-- paren\n\t\t| "+" PriAExp\t\t-- pos\n\t\t| var\n\t\t| number\n\n\tbool (a bool value)\n\t\t= "true" ~var\n\t\t| "false" ~var\n\n\tvar  (a variable)\n\t\t= letter+\n\n\tnumber\t(positive and negative integers)\n\t\t= "-" digit+\t-- negative\n\t\t| digit+\t\t-- positive\n}'
	},
	'WHILE',
	null,
	'Program',
	{
		Program: [
			'define',
			{ sourceInterval: [9, 36] },
			null,
			[],
			[
				'alt',
				{ sourceInterval: [19, 36] },
				['app', { sourceInterval: [19, 22] }, 'Cmd', []],
				['app', { sourceInterval: [25, 29] }, 'BExp', []],
				['app', { sourceInterval: [32, 36] }, 'AExp', []]
			]
		],
		Cmd_seq: [
			'define',
			{ sourceInterval: [71, 95] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [71, 82] },
				['app', { sourceInterval: [71, 74] }, 'Cmd', []],
				['terminal', { sourceInterval: [75, 78] }, ';'],
				['app', { sourceInterval: [79, 82] }, 'Cmd', []]
			]
		],
		Cmd_if: [
			'define',
			{ sourceInterval: [100, 143] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [100, 137] },
				['terminal', { sourceInterval: [100, 104] }, 'if'],
				['app', { sourceInterval: [105, 109] }, 'BExp', []],
				['terminal', { sourceInterval: [110, 116] }, 'then'],
				['app', { sourceInterval: [117, 120] }, 'Cmd', []],
				['terminal', { sourceInterval: [121, 127] }, 'else'],
				['app', { sourceInterval: [128, 131] }, 'Cmd', []],
				['terminal', { sourceInterval: [132, 137] }, 'end']
			]
		],
		Cmd_while: [
			'define',
			{ sourceInterval: [148, 186] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [148, 175] },
				['terminal', { sourceInterval: [148, 155] }, 'while'],
				['app', { sourceInterval: [156, 160] }, 'BExp', []],
				['terminal', { sourceInterval: [161, 165] }, 'do'],
				['app', { sourceInterval: [166, 169] }, 'Cmd', []],
				['terminal', { sourceInterval: [170, 175] }, 'end']
			]
		],
		Cmd_assign: [
			'define',
			{ sourceInterval: [191, 220] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [191, 204] },
				['app', { sourceInterval: [191, 194] }, 'var', []],
				['terminal', { sourceInterval: [195, 199] }, ':='],
				['app', { sourceInterval: [200, 204] }, 'AExp', []]
			]
		],
		Cmd_skip: [
			'define',
			{ sourceInterval: [225, 246] },
			null,
			[],
			['terminal', { sourceInterval: [225, 231] }, 'skip']
		],
		Cmd: [
			'define',
			{ sourceInterval: [39, 246] },
			'commands / statements',
			[],
			[
				'alt',
				{ sourceInterval: [71, 246] },
				['app', { sourceInterval: [71, 82] }, 'Cmd_seq', []],
				['app', { sourceInterval: [100, 137] }, 'Cmd_if', []],
				['app', { sourceInterval: [148, 175] }, 'Cmd_while', []],
				['app', { sourceInterval: [191, 204] }, 'Cmd_assign', []],
				['app', { sourceInterval: [225, 231] }, 'Cmd_skip', []]
			]
		],
		BExp_and: [
			'define',
			{ sourceInterval: [258, 279] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [258, 272] },
				['app', { sourceInterval: [258, 262] }, 'BExp', []],
				['terminal', { sourceInterval: [263, 267] }, '&&'],
				['app', { sourceInterval: [268, 272] }, 'BExp', []]
			]
		],
		BExp_or: [
			'define',
			{ sourceInterval: [284, 304] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [284, 298] },
				['app', { sourceInterval: [284, 288] }, 'BExp', []],
				['terminal', { sourceInterval: [289, 293] }, '||'],
				['app', { sourceInterval: [294, 298] }, 'BExp', []]
			]
		],
		BExp_not: [
			'define',
			{ sourceInterval: [315, 334] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [315, 326] },
				['terminal', { sourceInterval: [315, 318] }, '!'],
				['app', { sourceInterval: [319, 326] }, 'PriBExp', []]
			]
		],
		BExp: [
			'define',
			{ sourceInterval: [249, 352] },
			null,
			[],
			[
				'alt',
				{ sourceInterval: [258, 352] },
				['app', { sourceInterval: [258, 272] }, 'BExp_and', []],
				['app', { sourceInterval: [284, 298] }, 'BExp_or', []],
				['app', { sourceInterval: [315, 326] }, 'BExp_not', []],
				['app', { sourceInterval: [345, 352] }, 'PriBExp', []]
			]
		],
		PriBExp_paren: [
			'define',
			{ sourceInterval: [367, 389] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [367, 379] },
				['terminal', { sourceInterval: [367, 370] }, '('],
				['app', { sourceInterval: [371, 375] }, 'BExp', []],
				['terminal', { sourceInterval: [376, 379] }, ')']
			]
		],
		PriBExp_and: [
			'define',
			{ sourceInterval: [394, 414] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [394, 406] },
				['terminal', { sourceInterval: [394, 398] }, '&&'],
				['app', { sourceInterval: [399, 406] }, 'PriBExp', []]
			]
		],
		PriBExp_or: [
			'define',
			{ sourceInterval: [419, 438] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [419, 431] },
				['terminal', { sourceInterval: [419, 423] }, '||'],
				['app', { sourceInterval: [424, 431] }, 'PriBExp', []]
			]
		],
		PriBExp_eq: [
			'define',
			{ sourceInterval: [443, 463] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [443, 456] },
				['app', { sourceInterval: [443, 447] }, 'AExp', []],
				['terminal', { sourceInterval: [448, 451] }, '='],
				['app', { sourceInterval: [452, 456] }, 'AExp', []]
			]
		],
		PriBExp_gt: [
			'define',
			{ sourceInterval: [468, 488] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [468, 481] },
				['app', { sourceInterval: [468, 472] }, 'AExp', []],
				['terminal', { sourceInterval: [473, 476] }, '>'],
				['app', { sourceInterval: [477, 481] }, 'AExp', []]
			]
		],
		PriBExp_lt: [
			'define',
			{ sourceInterval: [493, 513] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [493, 506] },
				['app', { sourceInterval: [493, 497] }, 'AExp', []],
				['terminal', { sourceInterval: [498, 501] }, '<'],
				['app', { sourceInterval: [502, 506] }, 'AExp', []]
			]
		],
		PriBExp_geq: [
			'define',
			{ sourceInterval: [518, 539] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [518, 532] },
				['app', { sourceInterval: [518, 522] }, 'AExp', []],
				['terminal', { sourceInterval: [523, 527] }, '>='],
				['app', { sourceInterval: [528, 532] }, 'AExp', []]
			]
		],
		PriBExp_leq: [
			'define',
			{ sourceInterval: [544, 565] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [544, 558] },
				['app', { sourceInterval: [544, 548] }, 'AExp', []],
				['terminal', { sourceInterval: [549, 553] }, '<='],
				['app', { sourceInterval: [554, 558] }, 'AExp', []]
			]
		],
		PriBExp: [
			'define',
			{ sourceInterval: [355, 574] },
			null,
			[],
			[
				'alt',
				{ sourceInterval: [367, 574] },
				['app', { sourceInterval: [367, 379] }, 'PriBExp_paren', []],
				['app', { sourceInterval: [394, 406] }, 'PriBExp_and', []],
				['app', { sourceInterval: [419, 431] }, 'PriBExp_or', []],
				['app', { sourceInterval: [443, 456] }, 'PriBExp_eq', []],
				['app', { sourceInterval: [468, 481] }, 'PriBExp_gt', []],
				['app', { sourceInterval: [493, 506] }, 'PriBExp_lt', []],
				['app', { sourceInterval: [518, 532] }, 'PriBExp_geq', []],
				['app', { sourceInterval: [544, 558] }, 'PriBExp_leq', []],
				['app', { sourceInterval: [570, 574] }, 'bool', []]
			]
		],
		AExp_add: [
			'define',
			{ sourceInterval: [611, 632] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [611, 624] },
				['app', { sourceInterval: [611, 615] }, 'AExp', []],
				['terminal', { sourceInterval: [616, 619] }, '+'],
				['app', { sourceInterval: [620, 624] }, 'AExp', []]
			]
		],
		AExp_sub: [
			'define',
			{ sourceInterval: [637, 658] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [637, 650] },
				['app', { sourceInterval: [637, 641] }, 'AExp', []],
				['terminal', { sourceInterval: [642, 645] }, '-'],
				['app', { sourceInterval: [646, 650] }, 'AExp', []]
			]
		],
		AExp_mul: [
			'define',
			{ sourceInterval: [663, 686] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [663, 679] },
				['app', { sourceInterval: [663, 667] }, 'AExp', []],
				['terminal', { sourceInterval: [668, 671] }, '*'],
				['app', { sourceInterval: [672, 679] }, 'PriAExp', []]
			]
		],
		AExp: [
			'define',
			{ sourceInterval: [577, 698] },
			'arithmetic expressions',
			[],
			[
				'alt',
				{ sourceInterval: [611, 698] },
				['app', { sourceInterval: [611, 624] }, 'AExp_add', []],
				['app', { sourceInterval: [637, 650] }, 'AExp_sub', []],
				['app', { sourceInterval: [663, 679] }, 'AExp_mul', []],
				['app', { sourceInterval: [691, 698] }, 'PriAExp', []]
			]
		],
		PriAExp_paren: [
			'define',
			{ sourceInterval: [713, 735] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [713, 725] },
				['terminal', { sourceInterval: [713, 716] }, '('],
				['app', { sourceInterval: [717, 721] }, 'AExp', []],
				['terminal', { sourceInterval: [722, 725] }, ')']
			]
		],
		PriAExp_pos: [
			'define',
			{ sourceInterval: [740, 759] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [740, 751] },
				['terminal', { sourceInterval: [740, 743] }, '+'],
				['app', { sourceInterval: [744, 751] }, 'PriAExp', []]
			]
		],
		PriAExp: [
			'define',
			{ sourceInterval: [701, 778] },
			null,
			[],
			[
				'alt',
				{ sourceInterval: [713, 778] },
				['app', { sourceInterval: [713, 725] }, 'PriAExp_paren', []],
				['app', { sourceInterval: [740, 751] }, 'PriAExp_pos', []],
				['app', { sourceInterval: [764, 767] }, 'var', []],
				['app', { sourceInterval: [772, 778] }, 'number', []]
			]
		],
		bool: [
			'define',
			{ sourceInterval: [781, 833] },
			'a bool value',
			[],
			[
				'alt',
				{ sourceInterval: [805, 833] },
				[
					'seq',
					{ sourceInterval: [805, 816] },
					['terminal', { sourceInterval: [805, 811] }, 'true'],
					[
						'not',
						{ sourceInterval: [812, 816] },
						['app', { sourceInterval: [813, 816] }, 'var', []]
					]
				],
				[
					'seq',
					{ sourceInterval: [821, 833] },
					['terminal', { sourceInterval: [821, 828] }, 'false'],
					[
						'not',
						{ sourceInterval: [829, 833] },
						['app', { sourceInterval: [830, 833] }, 'var', []]
					]
				]
			]
		],
		var: [
			'define',
			{ sourceInterval: [836, 865] },
			'a variable',
			[],
			[
				'plus',
				{ sourceInterval: [858, 865] },
				['app', { sourceInterval: [858, 864] }, 'letter', []]
			]
		],
		number_negative: [
			'define',
			{ sourceInterval: [912, 934] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [912, 922] },
				['terminal', { sourceInterval: [912, 915] }, '-'],
				[
					'plus',
					{ sourceInterval: [916, 922] },
					['app', { sourceInterval: [916, 921] }, 'digit', []]
				]
			]
		],
		number_positive: [
			'define',
			{ sourceInterval: [939, 958] },
			null,
			[],
			['plus', { sourceInterval: [939, 945] }, ['app', { sourceInterval: [939, 944] }, 'digit', []]]
		],
		number: [
			'define',
			{ sourceInterval: [868, 958] },
			'positive and negative integers',
			[],
			[
				'alt',
				{ sourceInterval: [912, 958] },
				['app', { sourceInterval: [912, 922] }, 'number_negative', []],
				['app', { sourceInterval: [939, 945] }, 'number_positive', []]
			]
		]
	}
]);
export default result;
