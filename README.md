# Jira release GitHub Action

_... that works with monorepo_

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

The action is triggered when one or more tags are pushed to a repository. It
compares the tag with previous releases until it finds some commits, it does not
simply compare the last two tags because in a monorepo more than one tag can be
released simultaneously.

Then:

- Get the involved commits between the tag and the previous one (could not be
  the same package, tre previous is sense of time)
- Extracts the task number from the merged Pull Requests, (commit must follow
  `commitlint` format `XX-000`)
- Create a Jira release with the name of the tag
- Add the created release as the Fix version of the task numbers found in the
  commits
- Build release notes similar to the generated ones by Jira and set it in Jira
  release
- Generate the release nots in GitHub
- Create a GitHub release with the Jira release notes and the GitHub generated
  notes

# How to test locally

Use

```
npm run local-test
```

to test the action locally with the package
[Local Action Debugger](https://github.com/github/local-action). Set the
variables in

```
.local.action.env
```

in particular:

- `INPUT_GITHUB-TOKEN` with a valid GitHub token that has access to the repository
- `GITHUB_REF` e `GITHUB_REF_NAME` with the reference to the las tag
- `GITHUB_REF_TYPE` with `tag`
- `GITHUB_REPOSITORY` and `GITHUB_REPOSITORY_OWNER` with the test repository
