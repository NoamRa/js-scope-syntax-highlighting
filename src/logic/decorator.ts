import { EnhancedIdentifier } from "./types";
import { getStartEndFromNode, StartEnd } from "./utils";

export function decorateToken(
  code: string,
  { start, end }: StartEnd,
  className: string,
): string {
  const insert = (str: string, index: number, value: string): string => {
    return `${str.slice(0, index)}${value}${str.substr(index)}`;
  };
  const before = `<span class="${className}">`;
  const after = `</span>`;

  return insert(insert(code, end, after), start, before);
}

export function decorateCode(
  code: string,
  identifiers: EnhancedIdentifier[],
): string {
  return identifiers
    .sort((a: any, b: any) =>
      getStartEndFromNode(a).start < getStartEndFromNode(b).start ? 1 : -1,
    )
    .reduce(
      (currenctCode, identifier) =>
        decorateToken(
          currenctCode,
          getStartEndFromNode(identifier),
          "global", // TODO
        ),
      code,
    );
}
