import {
  externalSchematic,
  Rule,
  SchematicContext,
  Tree,
} from "@angular-devkit/schematics";

export function addAngularCliGhPages(): Rule {
  return (_: Tree, context: SchematicContext) => {
    // install angular-cli-ghpages using ng add command, so that it also updates angular.json
    context.logger.log("info", "⏳ Adding angular-cli-ghpages...");
    return externalSchematic("angular-cli-ghpages", "ng-add", {});
  };
}
