import type { Identifier, Node } from "estree";

export type NodeWithDepth = Node & { depth: number };
export type EnhancedIdentifier = Identifier & any; // TODO