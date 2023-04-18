// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	declare const APP_VERSION: string;

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	type OptionalResult<T> = { success: true; result: T } | { success: false; message: string };

	type Program = {
		name: string;
		initial_state: Vars;
		code: string;
	};

	type WHILEActionDict<T> = import('./lib/grammar/definitions/while.ohm-bundle').WHILEActionDict<T>;

	type SemanticsOperation<T> = {
		name: string;
		actions: WHILEActionDict<T>;
	};

	type Vars = Record<string, number | null>;
	type DerivationTree = Derivation;
	type EvalResult = {
		result: Vars;
		trace: Vars[];
	};

	type InterpretationResult = { eval: EvalResult; tree?: DerivationTree };

	type Success = { success: true; result: InterpretationResult };
	type Failure = { success: false; message?: string };
	type Interpretation = Success | Failure;

	type Derivation = {
		name: string;
		premises: string[];
		conclusion: {
			source: string;
			rule: string;
		};
		conditions?: string[];
	};
}

export {};
