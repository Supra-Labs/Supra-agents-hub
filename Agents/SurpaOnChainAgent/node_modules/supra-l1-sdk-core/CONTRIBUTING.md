# Contribution Guidelines for Typescript SDK

- Coding Styles
  - File names must use Snake case. For example, `supra_account.ts` .
  - Class names must use Pascal case. For example, `class AuthenticationKey` .
  - Function and method names must use Camel case. For example, `derivedAddress(): HexString` .
  - Constants must use all caps (upper case) words separated by `_`. For example, `MAX_U8_NUMBER` .
- Comments
  - Comments are required for new classes and functions.
  - Comments should follow the TSDoc standard, [https://tsdoc.org/](https://tsdoc.org/).
- Lints and Formats
  - ESlint (eslint) and Prettier (prettier) should be used for code checking and code formatting. Make sure to run `pnpm lint` and `pnpm fmt` after making changes to the code.
- Tests
  - Unit tests are required for any non-trivial changes you make.
  - The Jest testing framework is used in the repo and we recommend you use it. See Jest: [https://jestjs.io/](https://jestjs.io/).
  - Make sure to run `pnpm test` after making changes.
- Commits
  - Commit messages follow the [Angular convention](https://www.conventionalcommits.org/en/v1.0.0-beta.4/#summary).

## Creating a pull request

You are welcome to create a pull request against the main branch.

Before creating a PR,

- Make sure your branch is up to date with the `main` branch.
- On the root folder, run `pnpm test`.
- On the root folder, run `pnpm fmt`.
- On the root folder, run `pnpm lint`.

If everything passes, you should be able to create a PR.

#### Changelog

This project keeps a changelog. If a pull request created needs to bump a package version, please follow those steps to create a changelog

1. Bump the version in `package.json` according to [semver](https://semver.org/).
2. Bump the version in `version.ts`.
3. Add the change description in the CHANGELOG under the "Unreleased" section.
