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

  const octokit = github.getOctokit(gitHubToken);

  const {
    repo: { owner, repo },
    ref
  } = github.context;
  core.debug(`repo: ${repo}`);
  core.debug(`owner: ${owner}`);
  core.debug(`ref: ${ref}`);

  const listTagsResponse = await octokit.rest.repos.listTags({
    owner,
    repo,
    per_page: 20
  });
  core.debug(`listTagsResponse: ${JSON.stringify(listTagsResponse.data)}`);

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
