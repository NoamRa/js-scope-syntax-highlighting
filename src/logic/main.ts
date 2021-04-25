import type { Identifier, Node } from "estree";
import { decorateCode } from "./decorator";
import { lexer } from "./lexer";
import { parse } from "./parser";

import { analyze } from "eslint-scope";
import type { Scope } from "eslint-scope";
import { AnalyzedScope, ExtendedScope, TaggedIdentifer } from "./types";


export function analyzeCode(code: string) {
  const ast = parse(code);
  const x = analyze; // TODO remove
  const scopeManager = x(ast, { ecmaVersion: 2020 });
  // const { astWithDepth, nodes } = lexer(ast as Node);
  // const decoratedCode = decorateCode(code, nodes);
  const globalScope = scopeManager.acquire(ast);

  const analyzeScope = (scope: ExtendedScope): AnalyzedScope => {
    const declaredIdentifiers = scope.variables.reduce((decVars, variable) => {
      if (variable.identifiers.length > 0) {
        return {
          ...decVars,
          [variable.name]: { ...variable.identifiers[0] }, // TODO when more than one?
        };
      }
      return {
        ...decVars,
      };
    }, {});

    const undeclaredIdentifiers = scope.references.reduce(
      (undecVars, reference) => {
        if (!(reference.identifier.name in declaredIdentifiers)) {
          return {
            ...undecVars,
            [reference.identifier.name]: { ...reference.identifier },
          };
        }
        return {
          ...undecVars,
        };
      },
      {},
    );

    return {
      parentScope: scope.parentScope,
      type: scope.type,
      node: scope.block,
      declaredIdentifiers,
      undeclaredIdentifiers,
    };
  };

  const traverseScopes = (rootScope: Scope) => {
    // flat list of analyzed scopes
    const allScopes: AnalyzedScope[] = [];
    // root analyzed scope
    let rootAnalysedScope: AnalyzedScope | null = null;

    const scopes: ExtendedScope[] = [{ ...rootScope, parentScope: null }];

    while (scopes.length > 0) {
      const scope = scopes.pop() as ExtendedScope;
      const analysedScope = analyzeScope(scope);
      allScopes.push(analysedScope);
      if (!rootAnalysedScope) {
        rootAnalysedScope = analysedScope;
      }
      scopes.push(
        ...scope.childScopes.map<ExtendedScope>((scp) => ({
          ...scp,
          parentScope: analysedScope,
        })),
      );
    }

    return {
      rootAnalysedScope,
      allScopes,
    };
  };

  const tagIdentifiers = (allScopes: AnalyzedScope[]) => {
    let tag = 1;
    const allIdentifiers: TaggedIdentifer[] = [];
    allScopes.forEach((scope) =>
      Object.values(scope.declaredIdentifiers).forEach((ident) => {
        ident.tag = { id: tag };
        allIdentifiers.push(ident);
        tag += 1;
      }),
    );

    const resolveUndeclaredIdentifiers = (
      name: string,
      scope: AnalyzedScope,
    ): number => {
      let currentScope = scope;
      while (currentScope.parentScope !== null) {
        if (currentScope.parentScope.declaredIdentifiers[name]) {
          return currentScope.parentScope.declaredIdentifiers[name].tag!.id!;
        }
        currentScope = currentScope.parentScope;
      }
      return -1;
    };

    allScopes.forEach((scope) =>
      Object.values(scope.undeclaredIdentifiers).forEach((ident) => {
        ident.tag = { id: resolveUndeclaredIdentifiers(ident.name, scope) };
        allIdentifiers.push(ident);
      }),
    );

    return allIdentifiers;
  };

  const analyzedScope = traverseScopes(globalScope!);

  console.log(analyzedScope);

  const s = tagIdentifiers(analyzedScope.allScopes);
  console.log(s);
  // estraverse.traverse(ast as Node, {
  //   enter: function (node: any, parent: any) {
  //     const that = this;
  //     console.log({ enter: "enter", that, node, parent });
  //     // // do stuff

  //     // if (/Function/.test(node.type)) {
  //     //   currentScope = scopeManager.acquire(node); // get current function scope
  //     // }
  //   },
  //   leave: function (node: any, parent: any) {
  //     // if (/Function/.test(node.type)) {
  //     //   currentScope = currentScope.upper; // set to parent scope
  //     // }

  //     // // do stuff
  //     const that = this;
  //     console.log({ leave: "leave", that, node, parent });
  //   },
  // });

  const decoratedCode = decorateCode(code, s);

  return {
    ast,
    decoratedCode: decoratedCode,
  };
}
