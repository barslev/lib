import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import * as path from 'path';

import { Schema } from './schema';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-add <%= scopeWithName %>', () => {
  const schematicRunner = new SchematicTestRunner('<%= classify(name) %>', require.resolve(collectionPath));

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

    // it('works', async () => {
    //   const options: Schema = {};
    //   const tree: UnitTestTree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

    //   expect(tree.files).toContain('/path/to/added/file');
    // });
  });
});
