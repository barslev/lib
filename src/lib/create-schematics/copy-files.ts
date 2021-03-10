import {
  apply,
  filter,
  move,
  SchematicsException,
  Source,
  template,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { normalize, strings, workspaces } from "@angular-devkit/core";
import { Schema } from "../schema";
import { Schema as CreateSchematicsSchema } from "./schema";
import * as stringifyObject from "stringify-object";

export function copyFiles(
  importModule: boolean,
  options: Schema | CreateSchematicsSchema,
  importStatement: string,
  scopeWithName: string,
  packages: string[],
  tree: Tree,
  project: workspaces.ProjectDefinition,
  onlySchematics = false
): Source {
  const importModuleSet = stringifyObject(
    importModule
      ? [
          {
            moduleName: `${strings.classify(options.name)}Module`,
            importModuleStatement: importStatement,
            importPath: scopeWithName,
          },
        ]
      : [],
    { singleQuotes: true, indent: "  " }
  );

  let packagesWithVersion: { name: string; version: string }[] = [];
  if (packages.length > 1) {
    packagesWithVersion = packages
      .map((i: string) => i.trim())
      .map((i: string) => {
        const lastIndex = i.lastIndexOf("@");
        if (lastIndex < 0) {
          throw new SchematicsException(
            `Invalid package syntax for: ${i}. Valid format is: <PACKAGE_NAME>@<PACKAGE_VERSION>`
          );
        }
        return {
          name: i.substr(0, lastIndex),
          version: i.substr(lastIndex + 1),
        };
      });
  }

  const depthFromRootLib =
    "../" +
    scopeWithName
      .split("/")
      .map(() => "..")
      .join("/");

  const libDistPath = scopeWithName.replace("@", "");

  const fileDepth = !onlySchematics ? "." : "..";

  const templateSource = apply(url(`${fileDepth}/files/schematics`), [
    template({
      classify: strings.classify,
      scopeWithName,
      importStatement,
      packagesWithVersion: stringifyObject(packagesWithVersion, {
        singleQuotes: true,
        indent: "  ",
      }),
      importModuleSet,
      parse: JSON.parse,
      depthFromRootLib,
      libDistPath,
      name: options.name,
    }),
    filter((path) => !tree.exists(path)),
    move(normalize(`${project.sourceRoot}/..`)),
  ]);
  return templateSource;
}
