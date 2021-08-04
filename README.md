<p align="center">
 <img width="20%" height="20%" src="./logo.svg">
</p>

> Lets you focus on the stuff that matters

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)](https://github.com/ngneat/lib/blob/master/LICENSE)
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](https://github.com/ngneat/lib/commits/master)
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/ngneat/lib/pulls)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)

# @ngneat/lib <!-- omit in toc -->

Schematics that wrap the Angular generate library schematics and provide all the standard boilerplate you need in order to create a neat Angular open-source project.

```bash
ng add @ngneat/lib @scope/toaster # change @scope/toaster with your lib name
```

## Features <!-- omit in toc -->

- 👆 **Only Single command to do everything**
- 📂 **A schematic carrying scaffolding for Angular Library**
- 📄 **Contains community documents and templates which enhances open-source experiences with GitHub**
- 📦 **Semantic release support**
- ⚡ **GitHub Actions workflows**
- 🚀 **Site Deployment with angular-cli-ghpages**
- 🧑‍🤝‍🧑 **Adds All-Contributors specifications**
- 🔐 **Sets up Commitlint, husky, prettier and lint-staged**
- 📜 **Configures all needed scripts in package.json**
- 🐬 **Works with NX workspace**
- ✨ **Lints newly created library project**

## Table of Content <!-- omit in toc -->

- [Version](#version)
- [Usage](#usage)
  - [Create library with schematics](#create-library-with-schematics)
  - [Generate schematics in existing library](#generate-schematics-in-existing-library)
  - [Options](#options)
- [Development, release and deployment flow](#development-release-and-deployment-flow)
  - [Library Development](#library-development)
    - [Initial setup](#initial-setup)
    - [Running the library locally](#running-the-library-locally)
  - [Schematics Development](#schematics-development)
    - [Running schematics locally](#running-schematics-locally)
  - [Change `base-href` for deployment](#change-base-href-for-deployment)
  - [Commit messages](#commit-messages)
  - [Releases](#releases)
    - [Automated releases with GitHub Actions](#automated-releases-with-github-actions)
    - [Secrets and tokens](#secrets-and-tokens)
    - [Initial release](#initial-release)
    - [Working on a future release](#working-on-a-future-release)
  - [Deployment](#deployment)
    - [Automated deployment using GitHub Actions](#automated-deployment-using-github-actions)
    - [Manual deployment](#manual-deployment)
  - [Summary](#summary)
- [Files](#files)
- [Scripts](#scripts)
  - [Root package.json](#root-packagejson)
  - [Library package.json](#library-packagejson)
- [Hooks](#hooks)
- [Extras](#extras)
- [Badge](#badge)
- [Contributors ✨](#contributors-)

## Version

| Angular | @ngneat/lib |
| ------- | ----------- |
| v12     | 3.x.x       |
| v11     | 2.x.x       |

## Usage

### Create library with schematics

```bash
ng add @ngneat/lib @scope/toaster # change @scope/toaster with your lib name
```

### Generate schematics in existing library

```bash
ng generate @ngneat/lib:create-schematics @scope/toaster # change @scope/toaster with your lib name
```

### Options

| Name                    | Type                                         | Description                                                                                                                                                                                                            |
| ----------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                  | `string`                                     | The name of the library. Valid examples: `toaster`, `@scope/toaster`<br>*Default: `argv[0]`*                                                                                                                           |
| `scope`                 | `string`                                     | The npm scope of the library. Not needed if you are providing scope in `name` itself                                                                                                                                   |
| `ci`                    | `enum["github-actions", "travis", "circle"]` | Determine which CI tool to use.<br>*Default: `github-actions`*                                                                                                                                                         |
| `repositoryUrl`         | `string`                                     | The repository URL                                                                                                                                                                                                     |
| `skipLib`               | `boolean`                                    | When true, will not create the library. Useful when you only want to add schematics in your existing library                                                                                                           |
| `entryFile`             | `string`                                     | The path at which to create the library's public API file, relative to the workspace root.<br>*Default: `public-api`*                                                                                                  |
| `prefix`, `p`           | `string`                                     | A prefix to apply to generated selectors.<br>*Default: `lib`*                                                                                                                                                          |
| `skipPackageJson`       | `boolean`                                    | When true, does not add dependencies to the "package.json" file.<br>*Default: `false`*                                                                                                                                 |
| `skipInstall`           | `boolean`                                    | When true, does not install dependency packages.<br>*Default: `false`*                                                                                                                                                 |
| `skipTsConfig`          | `boolean`                                    | When true, does not update "tsconfig.json" to add a path mapping for the new library. The path mapping is needed to use the library in an app, but can be disabled here to simplify development.<br>*Default: `false`* |
| `skipSchematics`        | `boolean`                                    | When true, does not set schematics to support "ng add ..." command<br>*Default: `false`*                                                                                                                               |
| `skipAngularCliGhPages` | `boolean`                                    | When true, skips setting angular-cli-ghpages configurations<br>*Default: `false`*                                                                                                                                      |
| `botName`               | `string`                                     | This name will be used while deploying on GitHub Pages                                                                                                                                                                 |
| `botEmail`              | `string`                                     | This email will be used while deploying on GitHub Pages                                                                                                                                                                |
| `skipSpectator`         | `boolean`                                    | When true, does not add `@ngneat/spectator`<br>*Default: false*                                                                                                                                                        |

## Development, release and deployment flow

*This is very opinionated flow based on [semantic-release release workflow](https://semantic-release.gitbook.io/semantic-release/recipes/recipes#release-workflow), you can choose to have your own flow!*

### Library Development

#### Initial setup

Create a new project with Angular CLI:

```bash
npm i -g @angular/cli
ng new toaster # change toaster with your lib name
cd toaster
```

Create a fully-featured library project with **@ngneat/lib**:

```
ng add @ngneat/lib @scope/toaster
```

Answer the prompts and you will then have your library ready!

#### Running the library locally

Once you're done with creation of library, you can now start writing actual code for the same.

After adding minimal features, you will want to run and test your library in local environment, below is how you do it:

1. Import `ToastModule` from `@scope/toast` in your `app.module.ts`
2. Make necessary changes to run your library
3. Run the default project using `ng serve`
4. And test your library!

### Schematics Development

**@ngneat/lib** not only helps you to create an Angular library, but it also comes with a basic `ng add` schematics! So that you don't have to worry about setting up schematics from scratch.

Schematics for your library are present at `/projects/scope/toaster/schematics`. Everything is configured there, so can simply test it and make changes as needed.

#### Running schematics locally

To run and test schematics, you can follow below steps:

1. Run `npm run build:lib`
2. Go to library dist folder: `cd dist/scope/toaster`
3. Pack the library using npm: `npm pack` and it will create a `.tgz` file
4. Open the new terminal and go to another Angular project where you want to test
5. Run `ng add /path/to/.tgz/file` in new terminal

### Change `base-href` for deployment

Make sure to change `--base-href` in `deploy` script of `package.json`.

```json
{
  "scripts": {
    "deploy": "ng deploy --base-href=https://username.github.io/repo/",
  },
}

```

### Commit messages

Apart from library and schematics setup, **@ngneat/lib** helps you to follow [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) by adding all the needed setup.

Simply run `npm run commit` each time you when you commit. And answer the prompts to get a formatted commit messages.

### Releases

#### Automated releases with GitHub Actions

**@ngneat/lib** adds a workflow called `release.yml` to make you release fully automated. You simply need to keep pushing using [formatted commit messages](#commit-messages) and rest will be taken care!

| Workflow      | Runs On        | Tasks                                                                                                                                                                                                                                                         |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `release.yml` | ✔️ All Branches | ✔️ Lint<br>✔️ Build<br>✔️ Test<br>✔️ Versioning based on the [Semantic Versioning](http://semver.org/) specification.<br>✔️ Publish library on specific channel<br>✔️ Make release tag on GitHub<br>✔️ Adds `released@channel` label and friendly comments on issues |

#### Secrets and tokens

You will need to create `NPM_TOKEN` and `GH_TOKEN` tokens for `semantic-release` and `angular-cli-ghpages` to work perfectly. Read more [here](https:/ semantic-release.gitbook.io/semantic-release/usage/ci-configuration#authentication-for-plugins) .

#### Initial release

Let's start by making the first commit with message: `feat: initial commit`. When pushing this commit, on `master` branch, **semantics-release** will release the version `1.0.0` and users can use it from the default distribution channel, i.e. the dist-tag `@latest` for npm.

So, up-to now, Git history looks like this:

```
* feat: initial commit # => v1.0.0 on @latest
```

#### Working on a future release

We now want to work on a future major release, which can have multiple features, some of them will be breaking changes. But, before making it available to our users, we want to make sure that all the features are developed and tested. And we also do not want to increment our package version.

For above, we can create the branch `beta` (name can be `alpha`, `beta`, `next`, `next-major`, but only `alpha` and `beta` support pre-releasing in default semantic-release configuration) and commit the first feature there. Once pushed, **semantic-release** will publish the pre-release version `2.0.0-beta.1` on the dist-tag `@beta`. This helps us to run tests by installing the library with `npm install libName@beta` or `ng add libName@beta`. Other users installing with `npm install libName` or `ng add libName` will sill receive the version `1.0.0`.

The Git history of the repository is now:

```
* feat: initial commit # => v1.0.0 on @latest
| \
|  * feat: first feature \n\n BREAKING CHANGE: it breaks something # => v2.0.0-beta.1 on @beta
```

We can continue to work on our future release by committing and pushing other features or bug fixes on the beta branch. With each push, semantic-release will publish a new pre-release on the dist-tag @beta, which allow us to run our integration tests.

With another feature, the Git history of the repository is now:

```
* feat: initial commit # => v1.0.0 on @latest
| \
|  * feat: first feature \n\n BREAKING CHANGE: it breaks something # => v2.0.0-beta.1 on @beta
|  * feat: second feature # => v2.0.0-beta.2 on @beta
```

For more in-depth guide to release workflow, visit [semantic-release](https://semantic-release.gitbook.io/semantic-release/recipes/recipes#release-workflow)

### Deployment

#### Automated deployment using GitHub Actions

**@ngneat/lib** has also added [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages) for deployment. There is one more workflow added called: `deploy.yml`:

| Workflow     | Runs On    | Tasks                               |
| ------------ | ---------- | ----------------------------------- |
| `deploy.yml` | ✔️ `master` | ✔️ Build<br>✔️ Deploy on GitHub Pages |

#### Manual deployment

You can simply run `npm run deploy` to deploy your default project on GitHub pages. But, automated way is recommended over this.

### Summary

To summarize with steps, below is what all you need to do:

1. Create new project using Angular CLI
2. Create library in it using `ng add @ngneat/lib @scope/libName`
3. Change `--base-href` of `deploy` script in root `package.json`
4. Develop your library
5. Write specs
6. Test your code in the project itself
7. Run `npm run test:lib`
8. Run `npm run build:lib`
9. Test the schematics
10. Run `npm run commit`
11. Push
12. Let GitHub Actions finish running tests and releases
13. And you're done with first release!
14. Make new branch (name can be `alpha`, `beta`, `next`, `next-major`)
15. Repeat steps 4 to 12
16. Install and test your library from distribution channels, e.g. `npm install @scope/libName@beta` or with schematics: `ng add @scope/libName@beta`
17. Once tested, merge with `master`
18. Again, let GitHub Actions finish running tests and releases
19. And you're done with next release!

## Files

Several files were created. Let's go over them:

```
- projects/
-   scope/
-     lib/
-       schematics/ # contains files for *ng add libName* support
-       src/ # contains lib source file
- .releaserc.json
- CODE_OF_CONDUCT.md
- commitlint.config.js
- CONTRIBUTING.md
- ISSUE_TEMPLATE.md
- LICENSE
- PULL_REQUEST_TEMPLATE.md
- README.md
```

## Scripts

### Root package.json

- `build:lib` - Builds the library and copies root README.md file to lib in dist folder
- `postbuild:lib` - Runs build command from lib's package.json
- `commit` - Creates a new commit message based on Angular commit message convention
- `contributors:add` - Adds a new contributor to the `README` file
- `deploy` - Deploys site to GitHub pages
- `semantic-release` - Runs semantic-release, should be run through CI
- `test:lib` - Runs tests
- `test:lib:headless` - Runs tests in headless mode with Chrome

### Library package.json

- `build` - Builds schematics
- `postbuild` - Runs below scripts once build is done
- `copy:schemas` - Copies schematics files to lib in dist folder
- `copy:collection` - Copies schematics/collection.json to schematics in dist folder

## Hooks

- `pre-commit`: Runs prettier on the staged files, and verifies that they don't contain `debugger`, `fit`, or `fdescribe`
- `pre-push`: Runs the `test:lib:headless` command

## Extras

- Running the `add` command  updates the `tsconfig.json` file so that you can import any files from the npm path (`@scope/name`) rather than from relative paths.

- It also populates the library's `package.json` with the initial required information. Make sure you verify the data is accurate before proceeding.

## Badge

Show that your project is based off of our lib

[![ngneat-lib](https://img.shields.io/badge/made%20with-%40ngneat%2Flib-ad1fe3?logo=angular)](https://github.com/ngneat/lib)

```markdown
[![ngneat-lib](https://img.shields.io/badge/made%20with-%40ngneat%2Flib-ad1fe3?logo=angular)](https://github.com/ngneat/lib)
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/itayod"><img src="https://avatars2.githubusercontent.com/u/6719615?v=4" width="100px;" alt=""/><br /><sub><b>Itay Oded</b></sub></a><br /><a href="https://github.com/@ngneat/lib/commits?author=itayod" title="Code">💻</a></td>
    <td align="center"><a href="https://www.netbasal.com"><img src="https://avatars1.githubusercontent.com/u/6745730?v=4" width="100px;" alt=""/><br /><sub><b>Netanel Basal</b></sub></a><br /><a href="https://github.com/@ngneat/lib/commits?author=NetanelBasal" title="Documentation">📖</a> <a href="#ideas-NetanelBasal" title="Ideas, Planning, & Feedback">🤔</a> <a href="#projectManagement-NetanelBasal" title="Project Management">📆</a></td>
    <td align="center"><a href="https://stevenharris.dev"><img src="https://avatars0.githubusercontent.com/u/7720242?v=4" width="100px;" alt=""/><br /><sub><b>Steven Harris</b></sub></a><br /><a href="https://github.com/@ngneat/lib/commits?author=Steven-Harris" title="Code">💻</a></td>
    <td align="center"><a href="http://shhdharmen.me"><img src="https://avatars.githubusercontent.com/u/6831283?v=4" width="100px;" alt=""/><br /><sub><b>Dharmen Shah</b></sub></a><br /><a href="https://github.com/@ngneat/lib/commits?author=shhdharmen" title="Code">💻</a> <a href="#content-shhdharmen" title="Content">🖋</a> <a href="https://github.com/@ngneat/lib/commits?author=shhdharmen" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
