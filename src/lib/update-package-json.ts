import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";

import { getPackageJson, setPackageJson } from "../utils/package";
import { Schema } from "./schema";

function scriptsToAdd(
  libPath: string,
  libName: string,
  skipLib: boolean,
  skipSchematics: boolean
) {
  const basicScripts = {
    "contributors:add": "all-contributors add",
    "hooks:pre-commit": "node hooks/pre-commit.js",
    commit: "cz",
  };

  if (skipLib) {
    return {
      ...basicScripts,
      "test:headless": "cross-env CI=true npm run test",
    };
  }

  const distPath = libName.replace("@", "");

  const libsScripts = {
    deploy: `ng deploy --base-href=https://username.github.io/repo/`,
    copy: `cpx README.md dist/${distPath}`,
    "build:lib": `ng build ${libName} --prod && npm run copy`,
    "test:lib": `ng test ${libName}`,
    "test:lib:headless": "cross-env CI=true npm run test:lib",
  };

  if (skipSchematics) {
    return {
      ...basicScripts,
      ...libsScripts,
    };
  }

  const schematicsScripts = {
    "postbuild:lib": `npm run build --prefix ${libPath}`,
    "semantic-release": "semantic-release",
  };

  return {
    ...basicScripts,
    ...libsScripts,
    ...schematicsScripts,
  };
}

function generateHooks() {
  return {
    hooks: {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "npm run hooks:pre-commit && lint-staged",
    },
  };
}

const config = {
  commitizen: {
    path: "cz-conventional-changelog",
  },
};

const lintStaged = {
  "*.{js,json,css,scss,ts,html,component.html}": ["prettier --write"],
};

export function updatePackageJson(
  libPath: string,
  libName: string,
  options: Schema
): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.info("⌛ Updating root package.json...");
    const json = getPackageJson(host);

    json["config"] = config;
    json["lint-staged"] = lintStaged;
    json["scripts"] = {
      ...json.scripts,
      ...scriptsToAdd(
        libPath,
        libName,
        !!options.skipLib,
        options.skipSchematics
      ),
      ...(json.scripts["lint"] ? undefined : { lint: "ng lint" }),
      ...(json.scripts["test"] ? undefined : { test: "ng test" }),
    };
    json["husky"] = generateHooks();

    setPackageJson(host, json);
    return host;
  };
}
