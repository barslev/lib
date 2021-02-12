import { apply, filter, move, SchematicsException, template, url } from '@angular-devkit/schematics';
import { normalize, strings, workspaces } from '@angular-devkit/core';
import { Schema } from '../schema';

export function copyFiles(
  importModule: any,
  options: Schema,
  importStatement: any,
  scopeWithName: string,
  packages: any,
  tree,
  project: workspaces.ProjectDefinition
) {
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

  const depthFromRootLib = scopeWithName
    .split('/')
    .map((_) => '..')
    .join('/');

  const libDistPath = scopeWithName.replace('@', '');

  const templateSource = apply(url('./files_schematics'), [
    template({
      classify: strings.classify,
      scopeWithName,
      importStatement,
      packagesWithVersion,
      importModuleSet,
      parse: JSON.parse,
      depthFromRootLib,
      libDistPath,
    }),
    filter((path) => !tree.exists(path)),
    move(normalize(`${project.sourceRoot}/..`)),
  ]);
  return templateSource;
}
