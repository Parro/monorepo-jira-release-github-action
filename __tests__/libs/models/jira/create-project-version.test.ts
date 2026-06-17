import { jest, describe, it, expect } from '@jest/globals';

import createProjectVersion from '../../../../src/libs/models/jira/create-project-version';

describe('createProjectVersion tests', () => {
  it('should create a new project version', async () => {
    const domain = 'domain';
    const auth = 'auth';
    const version = {
      name: '@project@1.1.0',
      description: 'Been there, Done that',
      projectId: 123,
      releaseDate: '2026-01-01'
    };

    const fetchMock = jest.fn<typeof fetch>();

    global.fetch = fetchMock as unknown as typeof fetch;

    fetchMock.mockResolvedValue(new Response('{}', { status: 200 }));

    const expectedResponse = {};

    const response = await createProjectVersion({
      domain,
      auth,
      version
    });

    expect(response).toEqual(expectedResponse);

    expect(fetchMock).toHaveBeenCalledWith(
      `https://${domain}/rest/api/3/version`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en',
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
          'User-Agent': 'monorepo-jira-release-github-action/1.0.0'
        },
        body: JSON.stringify(version)
      }
    );
  });
});
