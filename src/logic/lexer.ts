import type { Identifier, Node } from "estree";
import type { NodeWithDepth } from "./types";
import traverse from "traverse";
import { tagIdentifier } from "./identifier";

function addDepthToAst(ast: Node, visitor?: Function) {
  return traverse(ast).map(function (node: Node) {
    if (node?.type) {
      const updatedNode = tagIdentifier(node as Identifier, { path: this.path, ast });
      (updatedNode as NodeWithDepth).depth = this.level;
      updatedNode?.identifierKind && visitor?.(updatedNode);
      return updatedNode
    };
    return node;
  });
}

export function lexer(ast: Node) {
  const nodes: NodeWithDepth[] = [];
  const nodeLogger = (node: any): void => {
    node.name
      ? console.log(`${node.depth} - ${node.type}, ${node.name}`)
      : console.log(`${node.depth} - ${node.type}`);
  };

  const visitor = (node: any): void => {
    nodeLogger(node);
    nodes.push(node);
  };

  const astWithDepth = addDepthToAst(ast, visitor);

  return { astWithDepth, nodes };
}
