import type * as monaco from 'monaco-editor';

const while_lang_definition: monaco.languages.IMonarchLanguage = {
	includeLF: true,

	defaultToken: '',
	tokenPostfix: '.WHILE',

	keywords: ['skip', 'while', 'do', 'end', 'if', 'then', 'else', 'end'],

	brackets: [
		{ open: '{', close: '}', token: 'delimiter.curly' },
		{ open: '[', close: ']', token: 'delimiter.bracket' },
		{ open: '(', close: ')', token: 'delimiter.parenthesis' }
	],

	tokenizer: {
		root: [
			{ include: '@whitespace' },
			{ include: '@numbers' },
			// { include: '@strings' },

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

const whileCompletionItemProvider = (
	Monaco: typeof monaco
): monaco.languages.CompletionItemProvider => ({
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	provideCompletionItems: async (model, position) => {
		const base = {
			kind: Monaco.languages.CompletionItemKind.Keyword,
			insertTextRules: Monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
		};

		return {
			suggestions: [
				{
					label: 'if statement',
					detail: 'Inserts `if then else` statement',
					insertText:
						'if ${1:condition} then\n\t${2:do something}\nelse\n\t${3:do something else}\nend',
					...base
				},
				{
					label: 'while loop',
					detail: 'Inserts `while` loop',
					insertText: 'while ${1:condition} do\n\t${2:do something}\nend',
					...base
				},
				{
					label: 'skip',
					detail: 'Inserts `skip`',
					insertText: 'skip',
					...base
				}
			]
		};
	}
});

const codeFormatter = (model: monaco.editor.ITextModel) => [
	{
		range: model.getFullModelRange(),
		// TODO: Format code
		text: model.getValue()
	}
];

export const createEditor = (domElement: HTMLElement, value: string, Monaco: typeof monaco) => {
	Monaco.languages.register({ id: 'while' });
	Monaco.languages.setMonarchTokensProvider('while', while_lang_definition);
	Monaco.languages.registerCompletionItemProvider('while', whileCompletionItemProvider(Monaco));
	Monaco.languages.registerDocumentFormattingEditProvider('while', {
		provideDocumentFormattingEdits: codeFormatter
	});

	const options: monaco.editor.IStandaloneEditorConstructionOptions = {
		theme: 'vs-dark',
		language: 'while',
		model: Monaco.editor.createModel(value, 'while'),
		wordWrap: 'on',
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
		}
	};

	return Monaco.editor.create(domElement, options);
};
