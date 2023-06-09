// AUTOGENERATED FILE
// This file was generated from while.ohm by `ohm generateBundles`.

import {
	BaseActionDict,
	Grammar,
	IterationNode,
	Node,
	NonterminalNode,
	Semantics,
	TerminalNode
} from 'ohm-js';

export interface WHILEActionDict<T> extends BaseActionDict<T> {
	Program?: (this: NonterminalNode, arg0: NonterminalNode) => T;
	Cmd_seq?: (
		this: NonterminalNode,
		arg0: NonterminalNode,
		arg1: TerminalNode,
		arg2: NonterminalNode
	) => T;
	Cmd_if?: (
		this: NonterminalNode,
		arg0: TerminalNode,
		arg1: NonterminalNode,
		arg2: TerminalNode,
		arg3: NonterminalNode,
		arg4: TerminalNode,
		arg5: NonterminalNode,
		arg6: TerminalNode
	) => T;
	Cmd_while?: (
		this: NonterminalNode,
		arg0: TerminalNode,
		arg1: NonterminalNode,
		arg2: TerminalNode,
		arg3: NonterminalNode,
		arg4: TerminalNode
	) => T;
	Cmd_assign?: (
		this: NonterminalNode,
		arg0: NonterminalNode,
		arg1: TerminalNode,
		arg2: NonterminalNode
	) => T;
	Cmd_skip?: (this: NonterminalNode, arg0: TerminalNode) => T;
	Cmd?: (this: NonterminalNode, arg0: NonterminalNode) => T;
	BExp_and?: (
		this: NonterminalNode,
		arg0: NonterminalNode,
		arg1: TerminalNode,
		arg2: NonterminalNode
	) => T;
	BExp_or?: (
		this: NonterminalNode,
		arg0: NonterminalNode,
		arg1: TerminalNode,
		arg2: NonterminalNode
	) => T;
	BExp_not?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode) => T;
	BExp?: (this: NonterminalNode, arg0: NonterminalNode) => T;
	PriBExp_paren?: (
		this: NonterminalNode,
		arg0: TerminalNode,
		arg1: NonterminalNode,
		arg2: TerminalNode
	) => T;
	PriBExp_and?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode) => T;
	PriBExp_or?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode) => T;
	PriBExp_eq?: (
		this: NonterminalNode,
		arg0: NonterminalNode,
		arg1: TerminalNode,
		arg2: NonterminalNode
	) => T;
	PriBExp_gt?: (
		this: NonterminalNode,
		arg0: NonterminalNode,
		arg1: TerminalNode,
		arg2: NonterminalNode
	) => T;
	PriBExp_lt?: (
		this: NonterminalNode,
		arg0: NonterminalNode,
		arg1: TerminalNode,
		arg2: NonterminalNode
	) => T;
	PriBExp_geq?: (
		this: NonterminalNode,
		arg0: NonterminalNode,
		arg1: TerminalNode,
		arg2: NonterminalNode
	) => T;
	PriBExp_leq?: (
		this: NonterminalNode,
		arg0: NonterminalNode,
		arg1: TerminalNode,
		arg2: NonterminalNode
	) => T;
	PriBExp?: (this: NonterminalNode, arg0: NonterminalNode) => T;
	AExp_add?: (
		this: NonterminalNode,
		arg0: NonterminalNode,
		arg1: TerminalNode,
		arg2: NonterminalNode
	) => T;
	AExp_sub?: (
		this: NonterminalNode,
		arg0: NonterminalNode,
		arg1: TerminalNode,
		arg2: NonterminalNode
	) => T;
	AExp_mul?: (
		this: NonterminalNode,
		arg0: NonterminalNode,
		arg1: TerminalNode,
		arg2: NonterminalNode
	) => T;
	AExp?: (this: NonterminalNode, arg0: NonterminalNode) => T;
	PriAExp_paren?: (
		this: NonterminalNode,
		arg0: TerminalNode,
		arg1: NonterminalNode,
		arg2: TerminalNode
	) => T;
	PriAExp_pos?: (this: NonterminalNode, arg0: TerminalNode, arg1: NonterminalNode) => T;
	PriAExp?: (this: NonterminalNode, arg0: NonterminalNode) => T;
	bool?: (this: NonterminalNode, arg0: TerminalNode) => T;
	var?: (this: NonterminalNode, arg0: IterationNode) => T;
	number_negative?: (this: NonterminalNode, arg0: TerminalNode, arg1: IterationNode) => T;
	number_positive?: (this: NonterminalNode, arg0: IterationNode) => T;
	number?: (this: NonterminalNode, arg0: NonterminalNode) => T;
}

export interface WHILESemantics extends Semantics {
	addOperation<T>(name: string, actionDict: WHILEActionDict<T>): this;
	extendOperation<T>(name: string, actionDict: WHILEActionDict<T>): this;
	addAttribute<T>(name: string, actionDict: WHILEActionDict<T>): this;
	extendAttribute<T>(name: string, actionDict: WHILEActionDict<T>): this;
}

export interface WHILEGrammar extends Grammar {
	createSemantics(): WHILESemantics;
	extendSemantics(superSemantics: WHILESemantics): WHILESemantics;
}

declare const grammar: WHILEGrammar;
export default grammar;
