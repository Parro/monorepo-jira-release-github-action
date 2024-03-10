import * as core from '@actions/core';
import * as github from '@actions/github';

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

  const oktokit = github.getOctokit(gitHubToken);

  const {
    repo: { owner, repo },
    ref
  } = github.context;
  core.debug(`repo: ${repo}`);
  core.debug(`owner: ${owner}`);
  core.debug(`ref: ${ref}`);

  const createReleaseResponse = await oktokit.rest.repos.createRelease({
    owner,
    repo,
    tag_name: ref
  });

  core.debug(`createReleaseResponse: ${createReleaseResponse}`);

  core.setOutput('Release url', createReleaseResponse.url);
};

export default main;
