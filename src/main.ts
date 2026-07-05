import * as core from '@actions/core';
import * as github from '@actions/github';

import getLastTags from './libs/models/github/get-last-tags';
import findInvolvedCommits from './libs/find-involved-commits';
import getCommitsMessage from './libs/get-commits-message';
import createProjectVersion from './libs/models/jira/create-project-version';
import updateIssue from './libs/models/jira/update-issue';
import getAtlassianAuthentication from './libs/models/jira/get-atlassian-authentication';
// import createRelease from './libs/create-release';

import { ProjectVersionPostRequest } from './libs/models/jira/types';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  const jiraEmail = core.getInput('jira_email');
  const jiraToken = core.getInput('jira_token');
  const jiraProjectDomain = core.getInput('jira_project_domain');
  const jiraProjectId = core.getInput('jira_project_id');
  const jiraProjectKey = core.getInput('jira_project_key');
  const gitHubToken = core.getInput('github-token');

  core.debug(`jiraProjectKey: ${jiraProjectKey}`);
  const octokit = github.getOctokit(gitHubToken);

  const {
    repo: { owner, repo },
    ref
  } = github.context;
  core.debug(`github.context: ${JSON.stringify(github.context)}`);
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

  const tag = ref.replace('refs/tags/', '');

  const atlassianAuth = getAtlassianAuthentication({
    email: jiraEmail,
    token: jiraToken
  });

  const versionData: ProjectVersionPostRequest = {
    name: tag,
    description: taskMessages.descriptions.join(', '),
    projectId: parseInt(jiraProjectId, 10),
    releaseDate: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
  };

  const version = await createProjectVersion({
    domain: jiraProjectDomain,
    auth: atlassianAuth,
    version: versionData
  });

  const updateIssuesPromises = taskMessages.tasks.map(async (task) => {
    return updateIssue({
      domain: jiraProjectDomain,
      auth: atlassianAuth,
      issueKey: task,
      issueData: {
        fixVersions: [{ add: { id: version.id } }]
      }
    });
  });

  core.debug(`version: ${JSON.stringify(version)}`);

  const updateIssuesResponses = await Promise.all(updateIssuesPromises);

  core.debug(`updateIssuesResponses: ${JSON.stringify(updateIssuesResponses)}`);
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
