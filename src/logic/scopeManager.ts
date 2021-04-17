import type { Identifier } from "estree"

// type Identifier = {
//   name: string;
//   start: number;
//   end: number;
// }

export type ScopeManager = {
  getId: () => string;
  addIdentifier: (identifier: Identifier) => void;
  isInCurrentScope: (identifier: Identifier) => boolean;
  isInParentScope: (identifier: Identifier) => boolean;
  getIdentifiers: () => Identifier[];
};

export default function scopeManager(
  id: string,
  parent?: ScopeManager,
): ScopeManager {
  const identifiers = new Map<string, Identifier>();

  const getId = () => id;

  const isInCurrentScope = (identifier: Identifier): boolean => {
    return identifiers.has(identifier.name);
  };

  const isInParentScope = (identifier: Identifier): boolean => {
    if (!parent) {
      return false;
    }
    return (
      parent.isInCurrentScope(identifier) || parent.isInParentScope(identifier)
    );
  };

  const addIdentifier = (identifier: Identifier): void => {
    if (!isInCurrentScope(identifier) && !isInParentScope(identifier)) {
      identifiers.set(identifier.name, identifier);
    }
  };

  const getIdentifiers = (): Identifier[] => {
    return [...identifiers].map(([k, v]) => v);
  }

  return {
    getId,
    addIdentifier,
    isInCurrentScope,
    isInParentScope,
    getIdentifiers
  };
}
