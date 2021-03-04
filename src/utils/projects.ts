import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { SchematicsException, Tree } from '@angular-devkit/schematics';

export function getWorkspacePath(host: Tree): string {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  const path = possibleFiles.filter((path) => host.exists(path))[0];

  return path;
}

export function getWorkspace(host: Tree): WorkspaceSchema {
  const path = getWorkspacePath(host);
  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const config = configBuffer.toString();

  return JSON.parse(config);
}

export function getProject(host: Tree, project?: string) {
  const workspace = getWorkspace(host);
  if (workspace.defaultProject) {
    return workspace.projects[workspace.defaultProject];
  } else if (project) {
    return workspace.projects[project];
  }

  throw new SchematicsException('could not find a workspace project');
}

export interface WorkspaceProject {
  root: string;
  projectType: string;
}

export function isLib(host: Tree, options: { project?: string | undefined; path?: string | undefined }) {
  const project = getProject(host, options.project);

  return project.projectType === 'library';
}
