import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";
import { RunSchematicTask } from "@angular-devkit/schematics/tasks";

export function lintFix(scopeWithName: string): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (tree.exists("/package.json")) {
      const buff = tree.read("/package.json");
      if (buff) {
        const content = JSON.parse(buff.toString());
        if (content["scripts"] && content["scripts"]["lint"]) {
          context.logger.info('⌛ Adding lint --fix task to context');
          context.addTask(
            new RunSchematicTask("@ngneat/lib", "lint-task", { scopeWithName })
          );
        }
      }
    }
  };
}
