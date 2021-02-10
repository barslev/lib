import { Rule, SchematicContext } from '@angular-devkit/schematics';
import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { isObservable, from, of, Observable } from 'rxjs';

export function isFunction(val: any): val is Function {
  return typeof val === 'function';
}

export function isPromise(v: any) {
  return v && isFunction(v.then);
}

export function observify<T>(asyncOrValue: any | T): Observable<T> {
  if (isPromise(asyncOrValue) || isObservable(asyncOrValue)) {
    return from(asyncOrValue) as Observable<T>;
  }

  return of(asyncOrValue);
}

export function toTree(ruleOrTree: Rule | any, tree: Tree, context: SchematicContext): Tree {
  return isFunction(ruleOrTree) ? ruleOrTree(tree, context) : (ruleOrTree as any);
}
