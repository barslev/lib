import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";
import { execSync } from "child_process";

export function addAngularCliGhPages(): Rule {
  return (host: Tree, context: SchematicContext) => {
    // install angular-cli-ghpages using ng add command, so that it also updates angular.json
    context.logger.log("info", "⏳ Executing- ng add angular-cli-ghpages...");
    execSync("ng add angular-cli-ghpages");
    return host;
  };
}
