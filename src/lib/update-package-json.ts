import { Tree } from '@angular-devkit/schematics';

import { getPackageJson, setPackageJson } from '../utils/package';
import { Schema } from './schema';

function scriptsToAdd(libPath: string, libName: string, skipLib: boolean) {
  const depthFromRootLib = libName
    .split('/')
    .map(_ => '..')
    .join('/');

  const basicScripts = {
    'contributors:add': 'all-contributors add',
    'hooks:pre-commit': 'node hooks/pre-commit.js',
    commit: 'git-cz',
    'release:first': 'npm run release -- --first-release'
  };

  if (skipLib) {
    return {
      ...basicScripts,
      release: 'standard-version && npm run build',
      'test:headless': 'cross-env CI=true npm run test'
    };
  }

  const distPath = libName.replace('@', '');

  return {
    ...basicScripts,
    deploy: `ng deploy --base-href=https://ngneat.github.io/libName/`,
    copy: `cp -r README.md dist/${distPath}`,
    'build:lib': `ng build ${libName} --prod && npm run copy`,
    'test:lib': `ng test ${libName}`,
    release: `cd ${libPath} && standard-version --infile ${depthFromRootLib}/../CHANGELOG.md`,
    'test:lib:headless': 'cross-env CI=true npm run test:lib'
  };
}

function generateHooks(skipLib: boolean) {
  return {
    hooks: {
      'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
      'pre-commit': 'npm run hooks:pre-commit && lint-staged'
    }
  };
}

const config = {
  commitizen: {
    path: 'cz-conventional-changelog'
  }
};

const lintStaged = {
  '*.{js,json,css,scss,ts,html,component.html}': ['prettier --write', 'git add']
};

export function updatePackageJson(host: Tree, libPath: string, libName: string, options: Schema) {
  const json = getPackageJson(host);

  json['config'] = config;
  json['lint-staged'] = lintStaged;
  json['scripts'] = {
    ...json.scripts,
    ...scriptsToAdd(libPath, libName, options.skipLib)
  };
  json['husky'] = generateHooks(options.skipLib);

  setPackageJson(host, json);
}
