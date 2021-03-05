import * as path from "path";
import {
  Tree,
  SchematicContext,
  externalSchematic,
  chain,
  Rule,
  noop,
  Action,
} from "@angular-devkit/schematics";
import { Schema as ComponentSchema } from "@schematics/angular/component/schema";

import { Schema } from "./schema";

export function addSpectator(options: Schema, scopeWithName: string): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info("⌛ Adding @ngneat/spectator...");
    const module = tree.actions.find(
      (action) => !!action.path.match(/\.module\.ts/)
    );
    if (!module) {
      return noop();
    }
    const component = externalSchematic(
      "@ngneat/spectator",
      "spectator-component",
      {
        path: path.dirname((module as Action).path),
        name: options.name,
        skipImport: true,
        flat: true,
        inlineStyle: true,
        inlineTemplate: true,
        project: scopeWithName,
      } as ComponentSchema
    );
    const service = externalSchematic(
      "@ngneat/spectator",
      "spectator-service",
      {
        path: path.dirname((module as Action).path),
        name: options.name,
      }
    );

    return chain([component, service]);
  };
}
