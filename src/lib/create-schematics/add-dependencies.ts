import { Tree } from "@angular-devkit/schematics";
import { addPackageToPackageJsonFactory } from "../../utils/package";

export function installSchematicsDependencies(
  host: Tree,
  onlySchematics = false
): void {
  const addPackageToPackageJson = addPackageToPackageJsonFactory(
    host,
    "devDependencies"
  );

  let deps = [
    {
      name: "cpx",
      version: "^1.5.0",
    },
    {
      name: "jsonc-parser",
      version: "^3.0.0",
    },
  ];

  if (!onlySchematics) {
    const semanticReleaseDeps = [
      {
        name: "@semantic-release/changelog",
        version: "^5.0.1",
      },
      {
        name: "@semantic-release/git",
        version: "^9.0.0",
      },
      {
        name: "semantic-release",
        version: "^17.3.8",
      },
    ];
    deps = deps.concat(semanticReleaseDeps);
  } else {
    const jestDeps = [
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
    ];
    deps = deps.concat(jestDeps);
  }

  deps.forEach((dep) => {
    addPackageToPackageJson(dep.name, dep.version);
  });
}
