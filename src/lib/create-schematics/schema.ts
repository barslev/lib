/**
 * Generate a schematics in the library project.
 */
export interface Schema {
  /**
   * The npm scope of the library.
   */
  scope?: string;
  /**
   * The name of the library.
   */
  name: string;
  /**
   * When true, skips prompts
   */
  skipPrompts: boolean;
  /**
   * When true, \"ng add ...\" command will import your module in client. Works only if skipPrompts is true
   */
  importModule: boolean;
  /**
   * The import statement when run through ng add. Works only if skipPrompts & importModule are true
   */
  importStatement: string;
  /**
   * 3rd party packages to add when run through ng add. Works only if skipPrompts is true
   */
  packages: string[];
}
