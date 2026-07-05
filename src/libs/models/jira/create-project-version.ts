import * as core from '@actions/core';
import type { CreateProjectVersion, ProjectVersion } from './types';

const createProjectVersion: CreateProjectVersion = async ({
  domain,
  auth,
  version
}) => {
  const url = `https://${domain}/rest/api/3/version`;
  core.debug(`createProjectVersion url: ${url}`);

  const bodyJson = version;

  const body = JSON.stringify(bodyJson);
  core.debug(`createProjectVersion body: ${body}}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en',
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      'User-Agent': 'monorepo-jira-release-github-action/1.0.0'
    },
    body
  });
  const data = (await response.json()) as ProjectVersion;

  core.debug(`createProjectVersion response data: ${JSON.stringify(data)}}`);

  return data;
};

export default createProjectVersion;
