import { virtualFs, workspaces } from "@angular-devkit/core";
import {
  Rule,
  SchematicContext,
  SchematicsException,
} from "@angular-devkit/schematics";
import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import { isObservable, from, of, Observable } from "rxjs";
import { Schema } from "../lib/schema";
import { Schema as CreateSchematicsSchema } from "../lib/create-schematics/schema";

export function isFunction(val: any): boolean {
  return typeof val === "function";
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

export function toTree(
  ruleOrTree: Rule | any,
  tree: Tree,
  context: SchematicContext
): Tree {
  return isFunction(ruleOrTree)
    ? ruleOrTree(tree, context)
    : (ruleOrTree as any);
}

export function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException("File not found.");
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

export function getLibPath(scopeWithName: string, isNx: boolean) {
  return `${isNx ? "libs" : "projects"}/${scopeWithName}`.replace("@", "");
}

export function splitScopeFromName(
  options: Schema | CreateSchematicsSchema
): Schema | CreateSchematicsSchema {
  if (!options.scope && options.name.includes("/")) {
    const splittedNameAndScope = options.name.split("/");
    options.scope = splittedNameAndScope[0];
    options.name = splittedNameAndScope[1];
  }
  return options;
}
