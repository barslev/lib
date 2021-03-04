import {
  externalSchematic,
  Tree,
  SchematicContext,
  Rule,
} from "@angular-devkit/schematics";
import * as fs from "fs";
import { Observable } from "rxjs";
import { tap, map } from "rxjs/operators";
import {
  getJSON,
  setJSON,
  readFile,
  writeFile,
  readFileFromFS,
} from "../utils/files";
import { observify, isFunction } from "../utils/helpers";
import { Schema } from "./schema";

function resolveTSConfig() {
  // if Angular's version is 10+ we need to update tsconfig.base.json
  const tsConfigPath = fs.existsSync("tsconfig.base.json")
    ? "tsconfig.base.json"
    : "tsconfig.json";
  // take tsConfig from the fs because we do not need angular's changes.
  let sourceText = readFileFromFS(tsConfigPath);
  // clean comments from file.
  sourceText = sourceText.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, "");

  return { path: tsConfigPath, json: JSON.parse(sourceText) };
}

function toTree(
  ruleOrTree: Rule | any,
  tree: Tree,
  context: SchematicContext
): Tree {
  return isFunction(ruleOrTree)
    ? ruleOrTree(tree, context)
    : (ruleOrTree as any);
}

function removeLibFiles(tree: Tree): Tree {
  tree.actions
    .filter((action) => !!action.path.match(/\.component|\.service/))
    .forEach((action) => tree.delete(action.path));

  return tree;
}

function updateTsConfig(host: Tree, name: string, libPath: string): Tree {
  const tsConfig = resolveTSConfig();
  const paths = {
    [name]: [`${libPath}/src/public-api.ts`],
  };
  tsConfig.json.compilerOptions.paths = {
    ...tsConfig.json.compilerOptions.paths,
    ...paths,
  };

  return setJSON(host, tsConfig.path, tsConfig.json);
}

function updateKarmaConfig(host: Tree, libPath: string): Tree {
  const karmaPath = `${libPath}/karma.conf.js`;
  if (host.exists(karmaPath)) {
    let karma = readFile(host, karmaPath);
    karma = karma.replace(
      /browsers:.*/,
      `browsers: [process.env.CI ? 'ChromeHeadless' : 'Chrome'],`
    );
    karma = karma.replace(/singleRun:.*/, `singleRun: process.env.CI,`);
    writeFile(karmaPath, karma, host);
  }

  return host;
}

function packageJSONExtensions(options: Schema, scopeWithName: string) {
  const repoUrl = options.repositoryUrl || `https://github.com/${options.name}`;
  const depthFromRootLib = scopeWithName
    .split("/")
    .map(() => "..")
    .join("/");
  const basicPkgJson = {
    version: "1.0.0",
    keywords: ["angular", "angular 2", options.name],
    license: "MIT",
    publishConfig: {
      access: "public",
    },
    bugs: {
      url: `${repoUrl}/issue`,
    },
    homepage: `${repoUrl}#readme`,
    repository: {
      type: "git",
      url: `${repoUrl}`,
    },
  };
  if (options.skipSchematics) {
    return basicPkgJson;
  }
  return {
    ...basicPkgJson,
    schematics: "./schematics/collection.json",
    scripts: {
      prebuild: "npm run test:schematics",
      build: "tsc -p tsconfig.schematics.json",
      "copy:schemas": `cpx schematics/ng-add ${depthFromRootLib}/dist/ngneat/hot-toast/`,
      "copy:collection": `cpx schematics/collection.json ${depthFromRootLib}/dist/ngneat/hot-toast/schematics/`,
      postbuild: "npm run copy:schemas && npm run copy:collection",
      "test:schematics": "npm run build && jest --watch",
    },
  };
}

function updatePackageJSON(
  options: Schema,
  libPath: string,
  tree: Tree,
  scopeWithName: string
): Tree {
  const packageJSONPath = `${libPath}/package.json`;

  if (!tree.exists(packageJSONPath)) {
    return tree;
  }
  const pkg = getJSON(tree, packageJSONPath) as Record<string, any>;

  return setJSON(tree, packageJSONPath, {
    ...pkg,
    ...packageJSONExtensions(options, scopeWithName),
  });
}

export function createLib(
  options: Schema,
  scopeWithName: string,
  libPath: string,
  tree: Tree,
  context: SchematicContext,
  isNx: boolean
): Observable<Tree> {
  const libRule = externalSchematic(
    isNx ? "@nrwl/angular" : "@schematics/angular",
    "library",
    {
      ...(!isNx && options),
      name: scopeWithName,
    }
  );
  const libTree$ = observify<Tree>(
    toTree(libRule(tree, context), tree, context)
  );

  return libTree$.pipe(
    tap((tree) => updatePackageJSON(options, libPath, tree, scopeWithName)),
    map(removeLibFiles),
    map((libTree) => updateTsConfig(libTree, scopeWithName, libPath)),
    map((libTree) => updateKarmaConfig(libTree, libPath))
  );
}
