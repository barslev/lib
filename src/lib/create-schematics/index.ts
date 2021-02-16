import { chain, mergeWith, Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { workspaces } from '@angular-devkit/core';
import { Schema } from '../schema';
import { installSchematicsDependencies } from './add-dependencies';
import { createHost } from '../../utils/helpers';
import { getPrompts } from './prompts';
import { copyFiles } from './copy-files';

export function createSchematics(options: Schema, scopeWithName: string): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    installSchematicsDependencies(tree, context);

    const { importModule, importStatement, packages } = await getPrompts(options);

    context.logger.info('packages : ' + packages);

    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);

    const project = workspace.projects.get(scopeWithName);
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${scopeWithName}`);
    }

    const templateSource = copyFiles(importModule, options, importStatement, scopeWithName, packages, tree, project);

    return chain([mergeWith(templateSource)]);
  };
}
