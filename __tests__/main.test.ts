import { jest, describe, expect, it } from '@jest/globals';

import { debugMocked, getInputMocked } from './__mocks__/external/core.mock';
import {
  githubMocked,
  getOctokitMocked
} from './__mocks__/external/github.mock';
import { getLastTagsMocked } from './__mocks__/libs/models/github/get-last-tags.mock';
import { findInvolvedCommitsMocked } from './__mocks__/libs/find-involved-commits.mock';
import { createProjectVersionMocked } from './__mocks__/libs/models/jira/create-project-version.mock';
import { createReleaseMocked } from './__mocks__/libs/models/github/create-release.mock';

import { run } from '../src/main';

describe('main tests', () => {
  it('should call the main script action', async () => {
    process.env.GITHUB_TOKEN = 'abcd123';

    githubMocked.context.ref = '@first-package@0.3.0';
    getInputMocked.mockImplementationOnce(() => 'user@email.com');
    getInputMocked.mockImplementationOnce(() => 'jira_tk123');
    getInputMocked.mockImplementationOnce(() => 'action.atlassian.net');
    getInputMocked.mockImplementationOnce(() => '1000');
    getInputMocked.mockImplementationOnce(() => 'AT');
    getInputMocked.mockImplementationOnce(() => 'abcd123');
    debugMocked.mockImplementationOnce(() => 'key');

    const graphqlClientMocked = jest.fn();
    const restClientMocked = jest.fn();
    const graphqlDefaultsMocked = jest.fn(() => graphqlClientMocked);
    (getOctokitMocked as jest.Mock).mockImplementationOnce(() => ({
      graphql: {
        defaults: graphqlDefaultsMocked
      },
      rest: restClientMocked
    }));
    getLastTagsMocked.mockResolvedValueOnce({
      repository: {
        refs: {
          edges: [
            { node: { name: '@second-package@0.3.0' } },
            { node: { name: '@first-package@0.3.0' } },
            { node: { name: '@second-package@0.2.0' } },
            { node: { name: '@second-package@0.1.0' } },
            { node: { name: '@first-package@0.2.0' } },
            { node: { name: '@first-package@0.1.0' } }
          ]
        }
      }
    });
    findInvolvedCommitsMocked.mockResolvedValueOnce([
      {
        oid: '3b34067b66a550f8c536fda2825c8103f8cbc0bb',
        message: 'AT-001 feat: Last commit'
      }
    ]);
    createProjectVersionMocked.mockResolvedValueOnce();
    createReleaseMocked.mockResolvedValueOnce({
      headers: {},
      status: 201,
      url: '',
      data: {
        url: '',
        html_url: 'string',
        assets_url: 'string',
        upload_url: 'string',
        tarball_url: 'string | null',
        zipball_url: 'string | null',
        id: 1,
        node_id: '',
        tag_name: '',
        target_commitish: 'string',
        name: '',
        draft: true,
        prerelease: true,
        created_at: '',
        published_at: '',
        author: {
          login: 'string',
          id: 1,
          node_id: 'string',
          avatar_url: 'string',
          gravatar_id: 'string',
          url: 'string',
          html_url: 'string',
          followers_url: 'string',
          following_url: 'string',
          gists_url: 'string',
          starred_url: 'string',
          subscriptions_url: 'string',
          organizations_url: 'string',
          repos_url: 'string',
          events_url: 'string',
          received_events_url: 'string',
          type: 'string',
          site_admin: false
        },
        assets: []
      }
    });

    await run();

    expect(getInputMocked).toHaveBeenCalledTimes(6);
    expect(getInputMocked).toHaveBeenNthCalledWith(1, 'jira_email');
    expect(getInputMocked).toHaveBeenNthCalledWith(2, 'jira_token');
    expect(getInputMocked).toHaveBeenNthCalledWith(3, 'jira_project_domain');
    expect(getInputMocked).toHaveBeenNthCalledWith(4, 'jira_project_id');
    expect(getInputMocked).toHaveBeenNthCalledWith(5, 'jira_project_key');
    expect(getInputMocked).toHaveBeenNthCalledWith(6, 'github-token');
    expect(getOctokitMocked).toHaveBeenCalledWith('abcd123');
    expect(graphqlDefaultsMocked).toHaveBeenCalledWith({
      headers: {
        authorization: 'token abcd123'
      }
    });
    expect(getLastTagsMocked).toHaveBeenCalledWith({
      client: graphqlClientMocked,
      first: 20,
      owner: 'owner',
      repo: 'repo'
    });
    expect(findInvolvedCommitsMocked).toHaveBeenCalledWith({
      client: graphqlClientMocked,
      owner: 'owner',
      repo: 'repo',
      currentTag: '@first-package@0.3.0',
      tagsList: [
        '@second-package@0.3.0',
        '@first-package@0.3.0',
        '@second-package@0.2.0',
        '@second-package@0.1.0',
        '@first-package@0.2.0',
        '@first-package@0.1.0'
      ]
    });
    expect(createProjectVersionMocked).toHaveBeenCalledWith({
      domain: 'action.atlassian.net',
      auth: 'dXNlckBlbWFpbC5jb206amlyYV90azEyMw==',
      version: {
        name: '@first-package@0.3.0',
        description: 'Last commit',
        projectId: 1000,
        releaseDate: expect.any(String)
      }
    });
    // expect(createReleaseMocked).toHaveBeenCalledWith({
    //   client: restClientMocked,
    //   owner: 'owner',
    //   repo: 'repo',
    //   name: '@first-package@0.3.0',
    //   tagName: '@first-package@0.3.0',
    //   body: ''
    // });
  });
});
