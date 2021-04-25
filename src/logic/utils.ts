import { EnhancedIdentifier } from "./types";

export function clone<T = Object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

type ObjectPath = Array<string | number>;
export function getValueByPath(obj: object, path: ObjectPath) {
  return path.reduce((currentObj: any, key: string | number) => {
    return currentObj[key];
  }, obj);
}

export function removeLastItems<T>(arr: T[], numberOfItems: number = 1): T[] {
  return arr.slice(0, arr.length - numberOfItems);
}

export function getAncestor(
  obj: object,
  path: ObjectPath,
  ancestor: number = 1,
) {
  return getValueByPath(obj, removeLastItems(path, ancestor));
}

export type StartEnd = { start: number; end: number };
export function getStartEndFromNode(node: any): StartEnd {
  if (Number.isInteger(node.start) && Number.isInteger(node.end)) {
    return {
      start: node.start,
      end: node.end,
    };
  } else if (Array.isArray(node.ranges) && node.ranges.length === 2) {
    return {
      start: node.ranges[0],
      end: node.ranges[1],
    };
  }
  throw new Error("Filed to find ");
}

export function sameObjects(objA: object, objB: object): boolean {
  // good enough for now...
  return JSON.stringify(objA) === JSON.stringify(objB);
}
