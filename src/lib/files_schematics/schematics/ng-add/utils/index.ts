import * as ts from 'typescript';
import { parseJson, JsonParseMode } from '@angular-devkit/core';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

export function getProjectFromWorkspace(workspace: WorkspaceSchema, projectName?: string): WorkspaceProject {
  const project = workspace.projects[projectName || workspace.defaultProject!];

  if (!project) {
    throw new Error(`Could not find project in workspace: ${projectName}`);
  }

  return project;
}

export function getProjectTargetOptions(project: WorkspaceProject, buildTarget: string) {
  const targetConfig =
    (project.architect && project.architect[buildTarget]) || (project.targets && project.targets[buildTarget]);

  if (targetConfig && targetConfig.options) {
    return targetConfig.options;
  }

  throw new Error(`Cannot determine project target configuration for: ${buildTarget}.`);
}

function sortObjectByKeys(obj: { [key: string]: string }) {
  return (
    Object.keys(obj)
      .sort()
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      .reduce((result: any, key: any) => (result[key] = obj[key]) && result, {})
  );
}

export function addPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {
  if (host.exists('package.json')) {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    if (!json.devDependencies) {
      json.devDependencies = {};
    }

    if (!json.dependencies[pkg]) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}

export function getSourceFile(host: Tree, path: string) {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not find file for path: ${path}`);
  }
  const content = buffer.toString();

  return ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
}

export function getWorkspacePath(host: Tree) {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  const path = possibleFiles.filter(filePath => host.exists(filePath))[0];
  return path;
}

export function getWorkspace(host: Tree) {
  const path = getWorkspacePath(host);
  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const content = configBuffer.toString();
  return parseJson(content, JsonParseMode.Loose);
}
