import { makeRecipe } from 'ohm-js';
const result = makeRecipe([
	'grammar',
	{
		source:
			'WHILE  {\n\tExp = Cmd\n\t\n\tCmd (commands / statements)\n\t\t= Cmd ";" Cmd\t\t\t\t\t\t\t-- seq\n\t\t| "if" BExp "then" Cmd "else" Cmd "end"\t-- if\n\t\t| "while" BExp "do" Cmd "end"\t\t\t-- while\n\t\t| var ":=" AExp\t\t\t\t\t\t\t-- assign\n\t\t| "skip"\t\t\t\t\t\t\t\t-- skip\n\t\t\n\tBExp (a Boolean expression)\n\t\t= AExp "=" AExp\t\t-- eq\n\t\t| AExp ">" AExp\t\t-- gt\n\t\t| AExp "<" AExp\t\t-- lt\n\t\t| AExp ">=" AExp\t-- geq\n\t\t| AExp "<=" AExp\t-- leq\n\t\t| "!" BExp\t\t\t-- not\n\t\t| BExp "&&" BExp\t-- and\n\t\t| BExp "||" BExp\t-- or\n\t\t| bool\t\t\t\t-- plain_bool\n\t\t\n\tAExp (an Arithmetic expression)\n\t\t=  AExp "+" AExp\t-- add\n\t\t| AExp "-" AExp\t\t-- sub\n\t\t| AExp "*" AExp\t\t-- mul\n\t\t| var\t\t\t\t-- variable_number\n\t\t| num\t\t\t\t-- plain_number\n\t\t\n\tbool (a bool value)\n\t\t= "true"\t-- true\n\t\t| "false"\t-- false\n\t\t\n\tnum (positive and negative integers)\n\t\t= "-" digit+\t--negative\n\t\t| digit+\t\t--positive\n\t\n\tvar (a variable)\n\t\t= letter+\n}'
	},
	'WHILE',
	null,
	'Exp',
	{
		Exp: [
			'define',
			{ sourceInterval: [10, 19] },
			null,
			[],
			['app', { sourceInterval: [16, 19] }, 'Cmd', []]
		],
		Cmd_seq: [
			'define',
			{ sourceInterval: [55, 79] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [55, 66] },
				['app', { sourceInterval: [55, 58] }, 'Cmd', []],
				['terminal', { sourceInterval: [59, 62] }, ';'],
				['app', { sourceInterval: [63, 66] }, 'Cmd', []]
			]
		],
		Cmd_if: [
			'define',
			{ sourceInterval: [84, 127] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [84, 121] },
				['terminal', { sourceInterval: [84, 88] }, 'if'],
				['app', { sourceInterval: [89, 93] }, 'BExp', []],
				['terminal', { sourceInterval: [94, 100] }, 'then'],
				['app', { sourceInterval: [101, 104] }, 'Cmd', []],
				['terminal', { sourceInterval: [105, 111] }, 'else'],
				['app', { sourceInterval: [112, 115] }, 'Cmd', []],
				['terminal', { sourceInterval: [116, 121] }, 'end']
			]
		],
		Cmd_while: [
			'define',
			{ sourceInterval: [132, 170] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [132, 159] },
				['terminal', { sourceInterval: [132, 139] }, 'while'],
				['app', { sourceInterval: [140, 144] }, 'BExp', []],
				['terminal', { sourceInterval: [145, 149] }, 'do'],
				['app', { sourceInterval: [150, 153] }, 'Cmd', []],
				['terminal', { sourceInterval: [154, 159] }, 'end']
			]
		],
		Cmd_assign: [
			'define',
			{ sourceInterval: [175, 204] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [175, 188] },
				['app', { sourceInterval: [175, 178] }, 'var', []],
				['terminal', { sourceInterval: [179, 183] }, ':='],
				['app', { sourceInterval: [184, 188] }, 'AExp', []]
			]
		],
		Cmd_skip: [
			'define',
			{ sourceInterval: [209, 230] },
			null,
			[],
			['terminal', { sourceInterval: [209, 215] }, 'skip']
		],
		Cmd: [
			'define',
			{ sourceInterval: [23, 230] },
			'commands / statements',
			[],
			[
				'alt',
				{ sourceInterval: [55, 230] },
				['app', { sourceInterval: [55, 66] }, 'Cmd_seq', []],
				['app', { sourceInterval: [84, 121] }, 'Cmd_if', []],
				['app', { sourceInterval: [132, 159] }, 'Cmd_while', []],
				['app', { sourceInterval: [175, 188] }, 'Cmd_assign', []],
				['app', { sourceInterval: [209, 215] }, 'Cmd_skip', []]
			]
		],
		BExp_eq: [
			'define',
			{ sourceInterval: [267, 287] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [267, 280] },
				['app', { sourceInterval: [267, 271] }, 'AExp', []],
				['terminal', { sourceInterval: [272, 275] }, '='],
				['app', { sourceInterval: [276, 280] }, 'AExp', []]
			]
		],
		BExp_gt: [
			'define',
			{ sourceInterval: [292, 312] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [292, 305] },
				['app', { sourceInterval: [292, 296] }, 'AExp', []],
				['terminal', { sourceInterval: [297, 300] }, '>'],
				['app', { sourceInterval: [301, 305] }, 'AExp', []]
			]
		],
		BExp_lt: [
			'define',
			{ sourceInterval: [317, 337] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [317, 330] },
				['app', { sourceInterval: [317, 321] }, 'AExp', []],
				['terminal', { sourceInterval: [322, 325] }, '<'],
				['app', { sourceInterval: [326, 330] }, 'AExp', []]
			]
		],
		BExp_geq: [
			'define',
			{ sourceInterval: [342, 363] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [342, 356] },
				['app', { sourceInterval: [342, 346] }, 'AExp', []],
				['terminal', { sourceInterval: [347, 351] }, '>='],
				['app', { sourceInterval: [352, 356] }, 'AExp', []]
			]
		],
		BExp_leq: [
			'define',
			{ sourceInterval: [368, 389] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [368, 382] },
				['app', { sourceInterval: [368, 372] }, 'AExp', []],
				['terminal', { sourceInterval: [373, 377] }, '<='],
				['app', { sourceInterval: [378, 382] }, 'AExp', []]
			]
		],
		BExp_not: [
			'define',
			{ sourceInterval: [394, 411] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [394, 402] },
				['terminal', { sourceInterval: [394, 397] }, '!'],
				['app', { sourceInterval: [398, 402] }, 'BExp', []]
			]
		],
		BExp_and: [
			'define',
			{ sourceInterval: [416, 437] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [416, 430] },
				['app', { sourceInterval: [416, 420] }, 'BExp', []],
				['terminal', { sourceInterval: [421, 425] }, '&&'],
				['app', { sourceInterval: [426, 430] }, 'BExp', []]
			]
		],
		BExp_or: [
			'define',
			{ sourceInterval: [442, 462] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [442, 456] },
				['app', { sourceInterval: [442, 446] }, 'BExp', []],
				['terminal', { sourceInterval: [447, 451] }, '||'],
				['app', { sourceInterval: [452, 456] }, 'BExp', []]
			]
		],
		BExp_plain_bool: [
			'define',
			{ sourceInterval: [467, 488] },
			null,
			[],
			['app', { sourceInterval: [467, 471] }, 'bool', []]
		],
		BExp: [
			'define',
			{ sourceInterval: [235, 488] },
			'a Boolean expression',
			[],
			[
				'alt',
				{ sourceInterval: [267, 488] },
				['app', { sourceInterval: [267, 280] }, 'BExp_eq', []],
				['app', { sourceInterval: [292, 305] }, 'BExp_gt', []],
				['app', { sourceInterval: [317, 330] }, 'BExp_lt', []],
				['app', { sourceInterval: [342, 356] }, 'BExp_geq', []],
				['app', { sourceInterval: [368, 382] }, 'BExp_leq', []],
				['app', { sourceInterval: [394, 402] }, 'BExp_not', []],
				['app', { sourceInterval: [416, 430] }, 'BExp_and', []],
				['app', { sourceInterval: [442, 456] }, 'BExp_or', []],
				['app', { sourceInterval: [467, 471] }, 'BExp_plain_bool', []]
			]
		],
		AExp_add: [
			'define',
			{ sourceInterval: [530, 550] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [530, 543] },
				['app', { sourceInterval: [530, 534] }, 'AExp', []],
				['terminal', { sourceInterval: [535, 538] }, '+'],
				['app', { sourceInterval: [539, 543] }, 'AExp', []]
			]
		],
		AExp_sub: [
			'define',
			{ sourceInterval: [555, 576] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [555, 568] },
				['app', { sourceInterval: [555, 559] }, 'AExp', []],
				['terminal', { sourceInterval: [560, 563] }, '-'],
				['app', { sourceInterval: [564, 568] }, 'AExp', []]
			]
		],
		AExp_mul: [
			'define',
			{ sourceInterval: [581, 602] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [581, 594] },
				['app', { sourceInterval: [581, 585] }, 'AExp', []],
				['terminal', { sourceInterval: [586, 589] }, '*'],
				['app', { sourceInterval: [590, 594] }, 'AExp', []]
			]
		],
		AExp_variable_number: [
			'define',
			{ sourceInterval: [607, 632] },
			null,
			[],
			['app', { sourceInterval: [607, 610] }, 'var', []]
		],
		AExp_plain_number: [
			'define',
			{ sourceInterval: [637, 659] },
			null,
			[],
			['app', { sourceInterval: [637, 640] }, 'num', []]
		],
		AExp: [
			'define',
			{ sourceInterval: [493, 659] },
			'an Arithmetic expression',
			[],
			[
				'alt',
				{ sourceInterval: [530, 659] },
				['app', { sourceInterval: [530, 543] }, 'AExp_add', []],
				['app', { sourceInterval: [555, 568] }, 'AExp_sub', []],
				['app', { sourceInterval: [581, 594] }, 'AExp_mul', []],
				['app', { sourceInterval: [607, 610] }, 'AExp_variable_number', []],
				['app', { sourceInterval: [637, 640] }, 'AExp_plain_number', []]
			]
		],
		bool_true: [
			'define',
			{ sourceInterval: [688, 702] },
			null,
			[],
			['terminal', { sourceInterval: [688, 694] }, 'true']
		],
		bool_false: [
			'define',
			{ sourceInterval: [707, 723] },
			null,
			[],
			['terminal', { sourceInterval: [707, 714] }, 'false']
		],
		bool: [
			'define',
			{ sourceInterval: [664, 723] },
			'a bool value',
			[],
			[
				'alt',
				{ sourceInterval: [688, 723] },
				['app', { sourceInterval: [688, 694] }, 'bool_true', []],
				['app', { sourceInterval: [707, 714] }, 'bool_false', []]
			]
		],
		num_negative: [
			'define',
			{ sourceInterval: [769, 790] },
			null,
			[],
			[
				'seq',
				{ sourceInterval: [769, 779] },
				['terminal', { sourceInterval: [769, 772] }, '-'],
				[
					'plus',
					{ sourceInterval: [773, 779] },
					['app', { sourceInterval: [773, 778] }, 'digit', []]
				]
			]
		],
		num_positive: [
			'define',
			{ sourceInterval: [795, 813] },
			null,
			[],
			['plus', { sourceInterval: [795, 801] }, ['app', { sourceInterval: [795, 800] }, 'digit', []]]
		],
		num: [
			'define',
			{ sourceInterval: [728, 813] },
			'positive and negative integers',
			[],
			[
				'alt',
				{ sourceInterval: [769, 813] },
				['app', { sourceInterval: [769, 779] }, 'num_negative', []],
				['app', { sourceInterval: [795, 801] }, 'num_positive', []]
			]
		],
		var: [
			'define',
			{ sourceInterval: [817, 845] },
			'a variable',
			[],
			[
				'plus',
				{ sourceInterval: [838, 845] },
				['app', { sourceInterval: [838, 844] }, 'letter', []]
			]
		]
	}
]);
export default result;
