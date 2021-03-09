import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import { addPackageToPackageJsonFactory } from "../utils/package";
import { Schema } from "./schema";
import { execSync } from "child_process";

export function installDependencies(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const deps = [
      {
        name: "@commitlint/cli",
        version: "^12.0.1",
      },
      {
        name: "@commitlint/config-conventional",
        version: "^12.0.1",
      },
      {
        name: "git-cz",
        version: "^4.7.6",
      },
      {
        name: "all-contributors-cli",
        version: "^6.20.0",
      },
      {
        name: "lint-staged",
        version: "^10.5.4",
      },
      {
        name: "prettier",
        version: "^2.2.1",
      },
      {
        name: "husky",
        version: "^5.1.2",
      },
      {
        name: "cross-env",
        version: "^7.0.3",
      },
      {
        name: "jest",
        version: "^26.6.3",
      },
      {
        name: "ts-jest",
        version: "^26.5.2",
      },
      {
        name: "@types/jest",
        version: "^26.0.20",
      },
      {
        name: "@types/jasmine",
        version: "~3.6.0",
      },
    ];

    if (!options.skipLib) {
      if (!options.skipSpectator) {
        // install spectator synchronously so we can use it for external schematics command later on.
        execSync("npm install --silent --save-dev @ngneat/spectator", { windowsHide: true });
        deps.push({ name: "@ngneat/spectator", version: "^7.0.0" });
      }
      if (!options.skipAngularCliGhPages) {
        // install angular-cli-ghpages synchronously so we can use it for external schematics command later on.
        execSync("npm install --silent --save-dev angular-cli-ghpages", { windowsHide: true });
        deps.push({ name: "angular-cli-ghpages", version: "^1.0.0-rc.1" });
      }
    }

    const addPackageToPackageJson = addPackageToPackageJsonFactory(
      host,
      "devDependencies"
    );

    deps.forEach((dep) => {
      addPackageToPackageJson(dep.name, dep.version);
    });

    context.addTask(new NodePackageInstallTask());
    context.logger.log("info", "⌛ Adding packages...");

    return host;
  };
}
