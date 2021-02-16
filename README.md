<p align="center">
 <img width="20%" height="20%" src="./logo.svg">
</p>

> Lets you focus on the stuff that matters

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)



<br >

![Demo](demo.gif)

<br >

# @ngneat/lib

Schematics that wrap the Angular generate library schematics and provide all the standard boilerplate you need in order to create a neat Angular open-source project.

## Features

- 👆 **Only Single command to do everything**
- 🗄️ **A schematic carrying scaffolding for Angular Library**
- 📄 **Contains community documents and templates which enhances open-source experiences with GitHub**
- 📦 **Semantic release support**
- ⚡ **GitHub Actions workflows**
- 🚀 **Site Deployment with angular-cli-ghpages**
- 🧑‍🤝‍🧑 **Adds All-Contributors specifications**
- 🔐 **Commitlint, husky and lint-staged**
- 📜 **Configures all needed scripts in package.json**

## Usage

```bash
ng add @ngneat/lib @scope/toaster # change @scope/toaster with your lib name
```

### Basic Working Flow

First of all, create `NPM_TOKEN` and `GH_TOKEN` tokens for semantic-release and angular-cli-ghpages to work perfectly. Read more [here](https://semantic-release.gitbook.io/semantic-release/usage/ci-configuration#authentication-for-plugins).

And then follow below steps each time:

1. Develop
2. Write specs
3. Run `npm run test:lib`,
4. Run `npm run build:lib`
5. Run `npm run commit`
6. Push
7. Workflows of GitHub Actions will publish on npm and make release tags

### Files

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

### Scripts

#### Root package.json

- `build:lib` - Builds the library and copies root README.md file to lib in dist folder
- `postbuild:lib` - Runs build command from lib's package.json
- `commit` - Creates a new commit message based on Angular commit message convention
- `contributors:add` - Adds a new contributor to the `README` file
- `deploy` - Deploys site to GitHub pages
- `semantic-release` - Runs semantic-release, should be run through CI
- `test:lib` - Runs tests
- `test:lib:headless` - Runs tests in headless mode with Chrome

#### Lib package.json

- `build` - Builds schematics
- `postbuild` - Runs below scripts once build is done
- `copy:schemas` - Copies schematics files to lib in dist folder
- `copy:collection` - Copies schematics/collection.json to schematics in dist folder

### Hooks

- `pre-commit`: Runs prettier on the staged files, and verifies that they don't contain `debugger`, `fit`, or `fdescribe`
- `pre-push`: Runs the `test:lib:headless` command

### Extras

- Running the `add` command  updates the `tsconfig.json` file so that you can import any files from the npm path (`@scope/name`) rather than from relative paths.

- It also populates the library's `package.json` with the initial required information. Make sure you verify the data is accurate before proceeding.

### Skipping the Library Creation

The schematics provide the --skipLib flag for cases where we want to generate everything except the library.

### Skipping the Schematics Creation

The schematics provide the --skipSchematics flag for cases where we want to generate everything except the schematics.

## Badge

Show that your project is based off of our lib

[![ngneat-lib](https://img.shields.io/badge/made%20with-%40ngneat%2Flib-ad1fe3?logo=angular)](https://github.com/ngneat/lib)

```
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
