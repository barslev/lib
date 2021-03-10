import {
  externalSchematic,
  Rule,
  SchematicContext,
  Tree,
} from "@angular-devkit/schematics";

export function addAngularCliGhPages(): Rule {
  return (_: Tree, context: SchematicContext) => {
    context.logger.log("info", "⏳ Adding angular-cli-ghpages...");
    return externalSchematic("angular-cli-ghpages", "ng-add", {});
  };
}
