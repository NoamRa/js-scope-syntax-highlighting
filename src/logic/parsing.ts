import * as acorn from "acorn";
import type { Node } from "estree";

// code taken from Kyle Simposn's You don't know JS
// https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch2.md
export const initialCode = `
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" }
];

function getStudentName(studentID) {
  for (let student of students) {
      if (student.id == studentID) {
          return student.name;
      }
  }
}

var nextStudent = getStudentName(73);
console.log(nextStudent);
`;

export function parse(code: string): acorn.Node {
  const ast = acorn.parse(code, { ecmaVersion: 2020 });
  collectScopes(ast as Node);
  return ast;
}

function clone<T = Object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function getChildNodes(node: NodeWithDepth): NodeWithDepth[] {
  return Object.values(node).reduce(
    (nodes: NodeWithDepth[], value): NodeWithDepth[] => {
      if (Array.isArray(value)) {
        return [...nodes, ...value];
      } else if (value?.type) {
        return [...nodes, value];
      } else {
        return [...nodes];
      }
    },
    [],
  );
}

type NodeWithDepth = Node & { depth: number };

/**
 * Traverse ESTree bredth first
 * @param ast
 * @param visitor
 */
function addDepthToAst(ast: Node, visitor?: Function): void {
  const addDepthToNode = (depth: number) => {
    return (node: Node): NodeWithDepth => ({
      ...node,
      depth,
    });
  };

  const bredthFirst = (
    head: NodeWithDepth,
    stack: NodeWithDepth[],
  ): NodeWithDepth[] => {
    return [
      ...getChildNodes(head).map(addDepthToNode(head.depth + 1)),
      ...stack,
    ];
  };

  const dive = (stack: NodeWithDepth[]): any => {
    if (stack.length === 0) return;
    const [head, ...tail] = stack;
    visitor?.(head);
    return dive(bredthFirst(head, tail));
  };

  dive([addDepthToNode(0)(ast)]);
}

/**
 * Given ast in ESTree structure, collect declerations and identifiers
 * @param ast
 * @returns
 */
export function collectScopes(ast: Node) {
  // const collected = [];
  const visitor = (node: any): void => {
    node.name
      ? console.log(`${node.depth} - ${node.type}, ${node.name}`)
      : console.log(`${node.depth} - ${node.type}`);
  };
  addDepthToAst(clone(ast), visitor);
}
