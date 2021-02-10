import {
  apply,
  chain,
  filter,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { capitalize } from '@angular-devkit/core/src/utils/strings';
import { normalize, strings, virtualFs, workspaces } from '@angular-devkit/core';
import * as prompts from 'prompts';
import { Schema } from './schema';

export function addSchematicsFiles(options: Schema, scopeWithName: string, tree: Tree): Rule {
  return mergeWith(
    apply(url(`./files_schematics`), [
      template({
        ...options,
        scopeWithName,
        capitalize
      }),
      filter(path => !tree.exists(path)),
      move('/')
    ]),
    MergeStrategy.Overwrite
  );
}

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
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
    }
  };
}

export function createSchematics(options: Schema, scopeWithName: string): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);

    const project = workspace.projects.get(scopeWithName);
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${scopeWithName}`);
    }

    const importModuleSet = JSON.stringify(
      options.importModule
        ? [
            {
              moduleName: `${strings.classify(options.name)}Module`,
              importModuleStatement: options.importStatement,
              importPath: scopeWithName
            }
          ]
        : []
    );

    const packagesWithVersion = JSON.stringify(
      options.packages
        .split(',')
        .map(i => i.trim())
        .map(i => ({ name: i.split(':')[0], version: i.split(':')[1] }))
    );

    console.log('importModuleSet', importModuleSet);
    console.log('packagesWithVersion', packagesWithVersion);

    const templateSource = apply(url('./files_schematics'), [
      template({
        classify: strings.classify,
        scopeWithName,
        importStatement: options.importStatement,
        packagesWithVersion,
        importModuleSet,
        parse: JSON.parse
      }),
      filter(path => !tree.exists(path)),
      move(normalize(`${project.sourceRoot}/..`))
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
