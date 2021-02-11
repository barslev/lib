import {
  apply,
  chain,
  filter,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { normalize, strings, workspaces } from '@angular-devkit/core';
import { Schema } from '../schema';
import { installSchematicsDependencies } from './add-dependencies';
import { createHost } from '../../utils/helpers';
import { getPrompts } from './prompts';

export function createSchematics(options: Schema, scopeWithName: string): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    installSchematicsDependencies(tree, context);

    const { importModule, importStatement, packages } = await getPrompts(options);

    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);

    const project = workspace.projects.get(scopeWithName);
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${scopeWithName}`);
    }

    const importModuleSet = JSON.stringify(
      importModule
        ? [
            {
              moduleName: `${strings.classify(options.name)}Module`,
              importModuleStatement: importStatement,
              importPath: scopeWithName,
            },
          ]
        : []
    );

    const packagesWithVersion = JSON.stringify(
      packages
        .split(',')
        .map((i: string) => i.trim())
        .map((i: string) => {
          if (!i.includes(':')) {
            throw new SchematicsException(
              `Invalid package syntax for: ${i}. Valid format is: <PACKAGE_NAME>:<PACKAGE_VERSION>`
            );
          }
          return { name: i.split(':')[0], version: i.split(':')[1] };
        })
    );

    const templateSource = apply(url('./files_schematics'), [
      template({
        classify: strings.classify,
        scopeWithName,
        importStatement,
        packagesWithVersion,
        importModuleSet,
        parse: JSON.parse,
      }),
      filter((path) => !tree.exists(path)),
      move(normalize(`${project.sourceRoot}/..`)),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
