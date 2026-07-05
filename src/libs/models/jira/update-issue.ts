import * as core from '@actions/core';
import type { UpdateIssue, UpdateIssueResponse } from './types';

const updateIssue: UpdateIssue = async ({
  domain,
  auth,
  issueKey,
  issueData
}) => {
  const url = `https://${domain}/rest/api/3/issue/${issueKey}?returnIssue=true`;
  core.debug(`updateIssue url: ${url}`);

  const bodyJson = { update: issueData };

  const body = JSON.stringify(bodyJson);
  core.debug(`updateIssue body: ${body}}`);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en',
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      'User-Agent': 'monorepo-jira-release-github-action/1.0.0'
    },
    body
  });
  const data = (await response.json()) as UpdateIssueResponse;

  core.debug(`updateIssue response data: ${JSON.stringify(data)}`);

  return data;
};

export default updateIssue;
