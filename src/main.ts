import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GraphQlQueryResponseData } from '@octokit/graphql';
import getLastTags from './libs/getLastTags';
import compareTags from './libs/compareTags';

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

  const graphqlClient = octokit.graphql.defaults({
    headers: {
      authorization: `token ${gitHubToken}`
    }
  });

  const tagsResponse = await getLastTags({
    client: graphqlClient,
    owner,
    repo,
    limit: 20
  });

  core.debug(`tags response: ${JSON.stringify(tagsResponse)}`);
  core.debug(`tags: ${JSON.stringify(tagsResponse.repository.refs.edges)}`);

  const tagsDifferenceGql = await compareTags({
    client: graphqlClient,
    owner,
    repo,
    beforeTag: tagsResponse.repository.refs.edges[1].node.name,
    lastTag: tagsResponse.repository.refs.edges[0].node.name
  });

  core.debug(`tagDifference: ${JSON.stringify(tagsDifferenceGql)}`);

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

  core.debug(`createReleaseResponse: ${JSON.stringify(createReleaseResponse)}`);

  core.setOutput('Release url', createReleaseResponse.url);
};

export default main;
