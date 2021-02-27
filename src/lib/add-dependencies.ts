import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageToPackageJsonFactory } from '../utils/package';
import { Schema } from './schema';
const { execSync } = require('child_process');

export function installDependencies(host: Tree, context: SchematicContext, options: Schema) {
  const deps = [
    {
      name: '@commitlint/cli',
      version: '^11.0.0',
    },
    {
      name: '@commitlint/config-angular',
      version: '^11.0.0',
    },
    {
      name: '@commitlint/config-conventional',
      version: '^11.0.0',
    },
    {
      name: 'git-cz',
      version: '^4.7.6',
    },
    {
      name: 'all-contributors-cli',
      version: '^6.19.0',
    },
    {
      name: 'lint-staged',
      version: '^10.5.3',
    },
    {
      name: 'prettier',
      version: '^2.2.1',
    },
    {
      name: 'husky',
      version: '^4.3.5',
    },
    {
      name: 'cross-env',
      version: '^7.0.3',
    },
  ];

  if (!options.skipLib) {
    if (!options.skipSpectator) {
      // install spectator synchronously so we can use it for external schematics command later on.
      execSync('npm install --save-dev @ngneat/spectator');
      deps.push({ name: '@ngneat/spectator', version: '^7.0.0' });
    }

    if (!options.skipAngularCliGhPages) {
      // install angular-cli-ghpages using ng add command, so that it also updates angular.json
      context.logger.log('info', '⚡ Executing- ng add angular-cli-ghpages');
      execSync('ng add angular-cli-ghpages');
    }
  }

  const addPackageToPackageJson = addPackageToPackageJsonFactory(host, 'devDependencies');

  deps.forEach((dep) => {
    addPackageToPackageJson(dep.name, dep.version);
  });

  context.addTask(new NodePackageInstallTask());
}
