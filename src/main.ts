import * as core from '@actions/core';
import * as github from '@actions/github';

import getLastTags from './libs/get-last-tags';
import findInvolvedCommits from './libs/find-involved-commits';
import getCommitsMessage from './libs/get-commits-message';
// import createRelease from './libs/create-release';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  // const jiraProjectDomain = core.getInput('jira_project_domain');
  // const jiraProjectId = core.getInput('jira_project_id');
  const jiraProjectKey = core.getInput('jira_project_key');
  const gitHubToken = core.getInput('github-token');

  core.debug(`jiraProjectKey: ${jiraProjectKey}`);
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
  core.debug(`tagsList: ${JSON.stringify(tagsList)}`);

  const involvedCommits = await findInvolvedCommits({
    client: graphqlClient,
    owner,
    repo,
    currentTag: ref,
    tagsList
  });

  core.debug(`involvedCommits: ${JSON.stringify(involvedCommits)}`);

  const taskMessages = getCommitsMessage({
    jiraProjectKey,
    commits: involvedCommits
  });

  core.debug(`taskMessages: ${JSON.stringify(taskMessages)}`);
  // const createReleaseResponse = await createRelease({
  //   client: octokit.rest,
  //   owner,
  //   repo,
  //   tagName: ref,
  //   name: ref,
  //   body: ''
  // });

  // core.debug(`createReleaseResponse: ${JSON.stringify(createReleaseResponse)}`);

  // core.setOutput('Release url', createReleaseResponse);
}

export default run;
