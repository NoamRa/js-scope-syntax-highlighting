import type { Node } from "estree";
import { decorateCode } from "./decorator";
import { lexer } from "./lexer";
import { parse } from "./parser";

export function analyzeCode(code: string) {
  const ast = parse(code);
  const { astWithDepth, nodes } = lexer(ast as Node);
  const decoratedCode = decorateCode(code, nodes);

  return {
    ast: astWithDepth,
    decoratedCode,
  };
}