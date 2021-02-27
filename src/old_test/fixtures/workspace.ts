import {
  UnitTestTree,
  SchematicTestRunner,
} from '@angular-devkit/schematics/testing';

export const defaultWorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '8.0.0',
  defaultProject: 'bar',
};

export function createWorkspace(
    schematicRunner: SchematicTestRunner,
    appTree: UnitTestTree,
    workspaceOptions = defaultWorkspaceOptions,
) {
  return schematicRunner.runExternalSchematicAsync(
      '@schematics/angular',
      'workspace',
      workspaceOptions
  ).toPromise();
}
