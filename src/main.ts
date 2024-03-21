import * as core from '@actions/core';
import * as github from '@actions/github';

import type { GraphQlQueryResponseData } from '@octokit/graphql';
import getLastTags from './libs/getLastTags';
import findInvolvedCommits from './libs/findInvolvedCommits';
import createRelease from './libs/createRelease';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function main(): Promise<void> {
  const jiraProjectDomain = core.getInput('jira_project_domain');
  const jiraProjectId = core.getInput('jira_project_id');
  const jiraProjectKey = core.getInput('jira_project_key');

  const gitHubToken = process.env.GITHUB_TOKEN as string;

  const octokit = github.getOctokit(gitHubToken);

  const {
    repo: { owner, repo },
    ref
  } = github.context;
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
    first: 20
  });

  core.debug(`tags  response: ${JSON.stringify(tagsResponse)}`);

  const tagsList = tagsResponse.repository.refs.edges.map(
    (edge: { node: { name: string } }) => edge.node.name
  );

  const involvedCommits = await findInvolvedCommits({
    client: graphqlClient,
    owner,
    repo,
    currentTag: ref,
    tagsList
  });

  console.log('🚀 ~ involvedCommits:', involvedCommits);
  const createReleaseResponse = await createRelease({
    client: octokit.rest,
    owner,
    repo,
    tagName: ref,
    name: ref,
    body: ''
  });

  core.debug(`createReleaseResponse: ${JSON.stringify(createReleaseResponse)}`);

  core.setOutput('Release url', createReleaseResponse);
}

export default main;
