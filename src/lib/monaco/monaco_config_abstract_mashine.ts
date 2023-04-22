import type * as monaco from 'monaco-editor';

const am_lang_definition: monaco.languages.IMonarchLanguage = {
	defaultToken: '',
	tokenPostfix: '.abstract_machine',

	keywords: [
		'PUSH',
		'PUSH',
		'ADD',
		'SUB',
		'MULT',
		'EQ',
		'GT',
		'LT',
		'GEQ',
		'LEQ',
		'NOT',
		'AND',
		'OR',
		'LOAD',
		'STO',
		'JMP',
		'JMPF'
	],

	brackets: [
		{ open: '{', close: '}', token: 'delimiter.curly' },
		{ open: '[', close: ']', token: 'delimiter.bracket' },
		{ open: '(', close: ')', token: 'delimiter.parenthesis' }
	],

	tokenizer: {
		root: [
			{ include: '@whitespace' },
			{ include: '@numbers' },
			{ include: '@strings' },

			[/[,:;]/, 'delimiter'],
			[/[{}\[\]()]/, '@brackets'],

			[/@[a-zA-Z]\w*/, 'tag'],
			[
				/[a-zA-Z]\w*/,
				{
					cases: {
						'@keywords': 'keyword',
						'@default': 'identifier'
					}
				}
			]
		],

		// Deal with white space, including single and multi-line comments
		whitespace: [
			[/\s+/, 'white'],
			[/(^#.*$)/, 'comment'],
			[/('''.*''')|(""".*""")/, 'string'],
			[/'''.*$/, 'string', '@endDocString'],
			[/""".*$/, 'string', '@endDblDocString']
		],
		endDocString: [
			[/\\'/, 'string'],
			[/.*'''/, 'string', '@popall'],
			[/.*$/, 'string']
		],
		endDblDocString: [
			[/\\"/, 'string'],
			[/.*"""/, 'string', '@popall'],
			[/.*$/, 'string']
		],

		// Recognize hex, negatives, decimals, imaginaries, longs, and scientific notation
		numbers: [
			[/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex'],
			[/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, 'number']
		],

		// Recognize strings, including those broken across lines with \ (but not without)
		strings: [
			[/'$/, 'string.escape', '@popall'],
			[/'/, 'string.escape', '@stringBody'],
			[/"$/, 'string.escape', '@popall'],
			[/"/, 'string.escape', '@dblStringBody']
		],
		stringBody: [
			[/[^\\']+$/, 'string', '@popall'],
			[/[^\\']+/, 'string'],
			[/\\./, 'string'],
			[/'/, 'string.escape', '@popall'],
			[/\\$/, 'string']
		],
		dblStringBody: [
			[/[^\\"]+$/, 'string', '@popall'],
			[/[^\\"]+/, 'string'],
			[/\\./, 'string'],
			[/"/, 'string.escape', '@popall'],
			[/\\$/, 'string']
		]
	}
};

export const createEditor = (
	domElement: HTMLElement,
	value: string,
	Monaco: typeof monaco,
	readOnly = false
) => {
	Monaco.languages.register({ id: 'abstract_machine' });
	Monaco.languages.setMonarchTokensProvider('abstract_machine', am_lang_definition);

	const options: monaco.editor.IStandaloneEditorConstructionOptions = {
		theme: 'vs-dark',
		language: 'while',
		model: Monaco.editor.createModel(value, 'abstract_machine'),
		wordWrap: 'off',
		automaticLayout: true,
		minimap: {
			enabled: true
		},
		scrollbar: {
			vertical: 'auto'
		},
		scrollBeyondLastLine: false,
		fontSize: 14,
		fontFamily: 'Fira Code',
		fontLigatures: true,
		cursorSmoothCaretAnimation: 'on',
		cursorBlinking: 'phase',
		unicodeHighlight: {
			invisibleCharacters: true
		},
		readOnly
	};

	return Monaco.editor.create(domElement, options);
};
