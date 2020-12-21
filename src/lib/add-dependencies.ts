import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageToPackageJsonFactory } from '../utils/package';
import { Schema } from './schema';
const { execSync } = require('child_process');

const deps = [
  {
    name: '@commitlint/cli',
    version: '^11.0.0'
  },
  {
    name: '@commitlint/config-angular',
    version: '^11.0.0'
  },
  {
    name: '@commitlint/config-conventional',
    version: '^11.0.0'
  },
  {
    name: 'git-cz',
    version: '^4.7.6'
  },
  {
    name: 'all-contributors-cli',
    version: '^6.19.0'
  },
  {
    name: 'lint-staged',
    version: '^10.5.3'
  },
  {
    name: 'prettier',
    version: '^2.2.1'
  },
  {
    name: 'standard-version',
    version: '^9.0.0'
  },
  {
    name: 'husky',
    version: '^4.3.5'
  },
  {
    name: 'cross-env',
    version: '^7.0.3'
  },
  {
    name: 'angular-cli-ghpages',
    version: '1.0.0-rc.1'
  }
];

export function installDependencies(host: Tree, context: SchematicContext, options: Schema) {
  const addPackageToPackageJson = addPackageToPackageJsonFactory(host, 'devDependencies');
  if (!options.skipLib) {
    // install spectator synchronously so we can use it for external schematics command later on.
    execSync('npm install --save-dev @ngneat/spectator');
    deps.push({
      name: '@ngneat/spectator',
      version: '^6.1.2'
    });
  }

  deps.forEach(dep => {
    addPackageToPackageJson(dep.name, dep.version);
  });

  context.addTask(new NodePackageInstallTask());
}
