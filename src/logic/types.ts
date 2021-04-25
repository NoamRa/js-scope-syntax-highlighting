import type { Identifier, Node } from "estree";
import type { Scope } from "eslint-scope";

export type NodeWithDepth = Node & { depth: number };
export type EnhancedIdentifier = Identifier & any; // TODO

export type ScopeTag = {
  id: number;
  // type: "variable" | "function";
};
export type TaggedIdentifer = Identifier & { tag?: ScopeTag };
export type Identifiers = Record<string, TaggedIdentifer>;
export type AnalyzedScope = {
  declaredIdentifiers: Identifiers;
  undeclaredIdentifiers: Identifiers;
  parentScope: AnalyzedScope | null;
  type: Scope["type"];
  node: Node;
};

export type ExtendedScope = Scope & {
  parentScope: AnalyzedScope | null;
};