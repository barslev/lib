import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import * as path from 'path';

import { Schema } from '../lib/schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-add', () => {
  const schematicRunner = new SchematicTestRunner('@ngneat/lib', require.resolve(collectionPath));

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0',
  };

  describe('with project', () => {
    let appTree: UnitTestTree;

    const appOptions: ApplicationOptions = {
      name: 'bar',
      inlineStyle: false,
      inlineTemplate: false,
      routing: false,
      style: Style.Css,
      skipTests: false,
      skipPackageJson: false,
    };

    beforeEach(async () => {
      appTree = await schematicRunner
        .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
        .toPromise();
      appTree = await schematicRunner
        .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, appTree)
        .toPromise();
    });

    it('fails with missing tree', (done) => {
      schematicRunner
        .runSchematicAsync(
          'ng-add',
          {
            name: 'test',
          },
          Tree.empty()
        )
        .subscribe({
          error: (err) => {
            expect(err).toBeTruthy();
            done();
          },
        });
    });

    it('fails with missing params', (done) => {
      schematicRunner.runSchematicAsync('ng-add', {}, appTree).subscribe({
        error: (err) => {
          expect(err).toBeTruthy();
          done();
        },
      });
    });

    it('works', async () => {
      const options: Schema = {
        name: '@scope/toast',
        ci: 'github-actions',
        skipAngularCliGhPages: true,
        skipSpectator: true,
        skipSchematics: false,
        skipPrompts: true,
        importModule: true,
        importStatement: 'ToastModule.forRoot()',
        packages: [],
      };
      const tree: UnitTestTree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

      expect(tree.files).toContain('/.github/workflows/test.yml');
    });
  });
});
