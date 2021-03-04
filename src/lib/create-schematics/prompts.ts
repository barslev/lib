import { strings } from "@angular-devkit/core";
import * as prompts from "prompts";
import { Schema } from "../schema";

export async function getPrompts(
  options: Schema
): Promise<prompts.Answers<string>> {
  const questions: prompts.PromptObject[] = [
    {
      type: "confirm",
      name: "importModule",
      message: 'Do you want "ng add" command to import your module in client?',
      initial: true,
    },
    {
      type: (prev) => (prev ? "text" : null),
      name: "importStatement",
      message: "What should be the import statement when run through ng add?",
      initial: `${strings.classify(options.name)}Module.forRoot()`,
    },
    {
      type: "list",
      name: "packages",
      message:
        "Do you want to add any 3rd party packages when run through ng add?\n(Comma separated values: package1@1.0.0, package2@1.0.0, ...)",
      initial: "",
      separator: ",",
    },
  ];

  return await prompts(questions);
}
