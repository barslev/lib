import { Tree, SchematicContext } from "@angular-devkit/schematics";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import { addPackageToPackageJsonFactory } from "../../utils/package";

export function installSchematicsDependencies(host: Tree, context: SchematicContext) {
    const addPackageToPackageJson = addPackageToPackageJsonFactory(host, 'devDependencies');
  
    const deps = [
      {
        name: 'jsonc-parser',
        version: '^3.0.0',
      },
    ];
  
    deps.forEach((dep) => {
      addPackageToPackageJson(dep.name, dep.version);
    });
  
    context.addTask(new NodePackageInstallTask());
  }