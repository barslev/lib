import { capitalize } from '@angular-devkit/core/src/utils/strings';
import {
  apply,
  url,
  template,
  move,
  mergeWith,
  Rule,
  MergeStrategy,
  filter,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { Schema } from './schema';

export function addFiles(options: Schema, scopeWithName: string, tree: Tree): Rule {
  const addRootFiles = mergeWith(
    apply(url(`./files/root`), [
      template({
        ...options,
        scopeWithName,
        capitalize,
        libDistPath: scopeWithName.replace('@', ''),
      }),
      filter((path) => !tree.exists(path)),
      move('/'),
    ]),
    MergeStrategy.Overwrite
  );
  const addCIFiles = mergeWith(
    apply(url(`./files/ci${options.ci === 'github-actions' ? '/github-actions' : ''}`), [
      template({
        ...options,
        scopeWithName,
        capitalize,
        libDistPath: scopeWithName.replace('@', ''),
      }),
      filter((path) => !tree.exists(path)),
      move('/'),
    ]),
    MergeStrategy.Overwrite
  );

  return chain([addRootFiles, addCIFiles]);
}
