import { execSync } from "child_process";

export function lintTask(options: { scopeWithName: string }) {
  return async () => {
    execSync("npm run lint -- --fix " + options.scopeWithName);
  };
}
