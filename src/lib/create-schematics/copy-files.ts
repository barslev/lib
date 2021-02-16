import { apply, filter, move, SchematicsException, template, Tree, url } from '@angular-devkit/schematics';
import { normalize, strings, workspaces } from '@angular-devkit/core';
import { Schema } from '../schema';

export function copyFiles(
  importModule: any,
  options: Schema,
  importStatement: any,
  scopeWithName: string,
  packages: string[],
  tree: Tree,
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

  let packagesWithVersion = [];
  if (packages.length > 1) {
    packagesWithVersion = packages
      .map((i: string) => i.trim())
      .map((i: string) => {
        const lastIndex = i.lastIndexOf('@');
        if (lastIndex < 0) {
          throw new SchematicsException(
            `Invalid package syntax for: ${i}. Valid format is: <PACKAGE_NAME>@<PACKAGE_VERSION>`
          );
        }
        return { name: i.substr(lastIndex + 1), version: i.substr(0, lastIndex) };
      });
  }

  const depthFromRootLib = scopeWithName
    .split('/')
    .map((_) => '..')
    .join('/');

  const libDistPath = scopeWithName.replace('@', '');

  const templateSource = apply(url('./files/schematics'), [
    template({
      classify: strings.classify,
      scopeWithName,
      importStatement,
      packagesWithVersion: JSON.stringify(packagesWithVersion),
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