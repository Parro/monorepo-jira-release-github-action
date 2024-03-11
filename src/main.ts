import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GraphQlQueryResponseData } from '@octokit/graphql';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
const main = async () => {
  const jiraProjectDomain = core.getInput('jira_project_domain');
  const jiraProjectId = core.getInput('jira_project_id');
  const jiraProjectKey = core.getInput('jira_project_key');
  core.debug(`jiraProjectDomain: ${jiraProjectDomain}`);
  core.debug(`jiraProjectId: ${jiraProjectId}`);
  core.debug(`jiraProjectKey: ${jiraProjectKey}`);

  const gitHubToken = process.env.GITHUB_TOKEN as string;
  core.debug(`gitHubToken: ${gitHubToken}`);

  const octokit = github.getOctokit(gitHubToken);

  const {
    repo: { owner, repo },
    ref
  } = github.context;
  core.debug(`repo: ${repo}`);
  core.debug(`owner: ${owner}`);
  core.debug(`ref: ${ref}`);

  const tagsResponse: GraphQlQueryResponseData = await octokit.graphql(
    `
      query ($owner: String!, $repo: String!, $last: Int) {
        repository(owner: $owner, name: $repo) {
          refs(refPrefix: "refs/tags/", last: $last, orderBy: {field: TAG_COMMIT_DATE, direction: DESC}) {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    `,
    {
      owner,
      repo,
      last: 20,
      headers: {
        authorization: `token ${gitHubToken}`
      }
    }
  );

  core.debug(`tags response: ${JSON.stringify(tagsResponse)}`);
  core.debug(`tags: ${JSON.stringify(tagsResponse.repository.refs.edges)}`);

  const listTagsResponse = await octokit.rest.repos.listTags({
    owner,
    repo,
    per_page: 20
  });
  core.debug(`listTagsResponse: ${JSON.stringify(listTagsResponse.data)}`);
  const tagsDifferenceGql: GraphQlQueryResponseData = await octokit.graphql(
    `
      query ($owner: String!, $repo: String!, $beforeTag: String!, $lastTag: String!) {
        repository(owner: $owner, name: $repo) {
          ref(qualifiedName: $beforeTag) {
            compare(headRef: $lastTag) {
              commits(first: 1) {
                nodes {
                  oid
                }
              }
            }
          }
        }
      }
    `,
    {
      owner,
      repo,
      beforeTag: tagsResponse.repository.refs.edges[1].node.name,
      lastTag: tagsResponse.repository.refs.edges[0].node.name,
      headers: {
        authorization: `token ${gitHubToken}`
      }
    }
  );

  core.debug(`tagDifference: ${JSON.stringify(tagsDifferenceGql)}`);

  const tagDifference = await octokit.rest.repos.compareCommitsWithBasehead({
    owner,
    repo,
    basehead: `${listTagsResponse.data[0].name}...${listTagsResponse.data[1].name}`,
    per_page: 1
  });
  core.debug(`tagDifference: ${JSON.stringify(tagDifference)}`);
  // const [latestCommit, previousCommit] = await Promise.all([
  //   octokit.rest.repos.getCommit({
  //     owner,
  //     repo,
  //     ref: latestTag.commit.sha
  //   }),
  //   octokit.rest.repos.getCommit({
  //     owner,
  //     repo,
  //     ref: previousTag.commit.sha
  //   })
  // ]);

  const createReleaseResponse = await octokit.rest.repos.createRelease({
    owner,
    repo,
    tag_name: ref
  });

  core.debug(`createReleaseResponse: ${createReleaseResponse}`);

  core.setOutput('Release url', createReleaseResponse.url);
};

export default main;
