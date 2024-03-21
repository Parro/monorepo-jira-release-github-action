import createRelease from '../../src/libs/createRelease';

import type { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';

describe('createRelease tests', () => {
  it('should create a GitHub release', async () => {
    const createReleaseMocked = jest.fn();
    const client = {
      repos: {
        createRelease: createReleaseMocked
      }
    } as unknown as Api['rest'];

    const owner = 'owner';
    const repo = 'repo';
    const name = '@first-package@0.2.0';
    const tagName = '@first-package@0.2.0';
    const body = 'Release notes - @first-package@0.2.0';

    await createRelease({ client, owner, repo, name, tagName, body });

    expect(createReleaseMocked).toHaveBeenCalledWith({
      owner,
      repo,
      name,
      tag_name: tagName,
      body,
      draft: true
    });
  });
});
