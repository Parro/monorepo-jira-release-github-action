import { describe, expect, it } from '@jest/globals';

import { debugMocked } from './external/core.mock';
import { githubMocked, getOctokitMocked } from './external/github.mock';
import { getLastTagsMocked } from '../src/libs/get-last-tags.mock';
import { findInvolvedCommitsMocked } from '../src/libs/find-involved-commits.mock';
import { createReleaseMocked } from '../src/libs/create-release.mock';

import { main } from '../src/main';

describe('main tests', () => {
  it('should call the main script action', async () => {
    process.env.GITHUB_TOKEN = 'abcd123';

    githubMocked.context.ref = '@first-package@0.3.0';
    getInputMocked.mockImplementationOnce(() => 'domain');
    getInputMocked.mockImplementationOnce(() => 'id');
    getInputMocked.mockImplementationOnce(() => 'key');
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
        message: 'Last commit'
      }
    ]);
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

    await main();

    expect(getInputMocked).toBeCalledTimes(3);
    expect(getInputMocked).toHaveBeenNthCalledWith(1, 'jira_project_domain');
    expect(getInputMocked).toHaveBeenNthCalledWith(2, 'jira_project_id');
    expect(getInputMocked).toHaveBeenNthCalledWith(3, 'jira_project_key');
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
    expect(createReleaseMocked).toHaveBeenCalledWith({
      client: restClientMocked,
      owner: 'owner',
      repo: 'repo',
      name: '@first-package@0.3.0',
      tagName: '@first-package@0.3.0',
      body: ''
    });
  });
});
