/**
 * Creates a new generic library project in the current workspace.
 */
export interface Schema {
  /**
   * The path at which to create the library's public API file, relative to the workspace root.
   */
  entryFile?: string;
  /**
   * The npm scope of the library.
   */
  scope?: string;
  /**
   * Determine which CI tool to use.
   */
  ci: "github-actions" | "circle" | "travis";
  /**
   * Determine which CI tool to use.
   */
  repositoryUrl?: string;
  /**
   * When true, will not create the library.
   */
  skipLib?: boolean;
  /**
   * The name of the library.
   */
  name: string;
  /**
   * A prefix to apply to generated selectors.
   */
  prefix?: string;
  /**
   * When true, does not install dependency packages.
   */
  skipInstall?: boolean;
  /**
   * When true, does not add dependencies to the "package.json" file.
   */
  skipPackageJson?: boolean;
  /**
   * When true, does not update "tsconfig.json" to add a path mapping for the new library. The
   * path mapping is needed to use the library in an app, but can be disabled here to simplify
   * development.
   */
  skipTsConfig?: boolean;
  /**
   * When true, does not set schematics to support "ng add ..." command
   */
  skipSchematics: boolean;
  /**
   * When true, skips setting angular-cli-ghpages configurations
   */
  skipAngularCliGhPages: boolean;
  /**
   * This name will be used while deploying on GitHub Pages
   */
  botName?: string;
  /**
   * This email will be used while deploying on GitHub Pages
   */
  botEmail?: string;
  /**
   * When true, does not add @ngneat/spectator
   */
  skipSpectator: boolean;
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
