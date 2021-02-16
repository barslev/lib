import { Tree, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageToPackageJsonFactory } from '../../utils/package';

export function installSchematicsDependencies(host: Tree, context: SchematicContext) {
  const addPackageToPackageJson = addPackageToPackageJsonFactory(host, 'devDependencies');

  const deps = [
    {
      name: '@semantic-release/changelog',
      version: '^5.0.1',
    },
    {
      name: '@semantic-release/git',
      version: '^9.0.0',
    },
    {
      name: 'cpx',
      version: '^1.5.0',
    },
    {
      name: 'jsonc-parser',
      version: '^3.0.0',
    },
    {
      name: 'semantic-release',
      version: '^17.3.8',
    },
  ];

  deps.forEach((dep) => {
    addPackageToPackageJson(dep.name, dep.version);
  });

  context.addTask(new NodePackageInstallTask());
}