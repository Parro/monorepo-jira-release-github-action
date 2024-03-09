# Jira release GitHub action

*... that works with monorepo*

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

- It extracts the task number from the merged Pull Requests, (commit must follow
  `commitlint` format `XX-000`)
- Create a Jira release with the name of the tag
- Add the created release as the Fix version of the task numbers found in the
  commits
- Build release notes similar to the generated ones by Jira and set it in Jira
  release
- Generate the release nots in GitHub
- Create a GitHub release with the Jira release notes and the GitHub generated
  notes
