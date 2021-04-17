import { Identifier, Node } from "estree";
import { getAncestor, sameObjects } from "./utils";

type IsRelevantIdentifierContext = { path: Array<string | number>; ast: Node };
type IsRelevantIdentifierFn = (
  identifier: Identifier,
  { path, ast }: IsRelevantIdentifierContext,
) => boolean;

type RelevantIdentifierItem = {
  name: string;
  check: IsRelevantIdentifierFn;
};

const relevantIdentifiers: RelevantIdentifierItem[] = [
  {
    name: "variable decleration",
    check: (identifier, { path, ast }) => {
      return getAncestor(ast, path).type === "VariableDeclarator";
    },
  },
  {
    name: "loop iterable",
    check: (identifier, { path, ast }) => {
      const parent = getAncestor(ast, path);
      return ["ForInStatement", "ForOfStatement"].includes(
        getAncestor(ast, path).type,
      );
    },
  },
  {
    name: "function decleration",
    check: (identifier, { path, ast }) => {
      return getAncestor(ast, path).type === "FunctionDeclaration";
    },
  },
  {
    name: "function argument",
    check: (identifier, { path, ast }) => {
      const parent = getAncestor(ast, path);
      if (Array.isArray(parent)) {
        const grandParent = getAncestor(ast, path, 2);
        if (grandParent.type === "FunctionDeclaration") {
          return true;
        }
      }
      return false;
    },
  },
  {
    name: "function call expression",
    check: (identifier, { path, ast }) => {
      return getAncestor(ast, path).type === "CallExpression";
    },
  },
  {
    name: "function call parameter",
    check: (identifier, { path, ast }) => {
      const parent = getAncestor(ast, path);
      if (Array.isArray(parent)) {
        const grandParent = getAncestor(ast, path, 2);
        if (grandParent.type === "CallExpression") {
          return true;
        }
      }
      return false;
    },
  },
  {
    // keep last
    name: "variable",
    check: (identifier) => {
      return identifier.type === "Identifier";
    },
  },
];

const irelevantIdentifiers: RelevantIdentifierItem[] = [
  {
    name: "object property assignment",
    check: (identifier, { path, ast }) => {
      return getAncestor(ast, path).type === "Property";
    },
  },
  {
    name: "object property",
    check: (identifier, { path, ast }) => {
      const parent = getAncestor(ast, path);
      return (
        parent.type === "MemberExpression" &&
        sameObjects(parent.property, identifier)
      );
    },
  },
];

function isIdentifier(identifier: Node): identifier is Identifier {
  return Boolean(identifier && identifier?.type === "Identifier");
}

export function tagIdentifier(
  node: Node,
  context: IsRelevantIdentifierContext,
): any {
  if (isIdentifier(node)) {
    const relevant = relevantIdentifiers.find(({ check }) =>
      check(node, context),
    );
    const irelevant = irelevantIdentifiers.find(({ check }) =>
      check(node, context),
    );
    if (relevant && !irelevant) {
      return {
        ...node,
        identifierKind: relevant.name,
      };
    }
  }
  return node;
}
