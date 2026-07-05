import { jest, describe, it, expect } from '@jest/globals';

import updateIssue from '../../../../src/libs/models/jira/update-issue';

describe('updateIssue tests', () => {
  it('should update an issue', async () => {
    const domain = 'domain';
    const auth = 'auth';
    const issueKey = 'AT-5';
    const issueData = {
      fixVersions: [
        {
          add: {
            id: '10068'
          }
        }
      ]
    };

    const fetchMock = jest.fn<typeof fetch>();

    global.fetch = fetchMock as unknown as typeof fetch;

    fetchMock.mockResolvedValue(new Response('{}', { status: 200 }));

    const expectedResponse = {};

    const response = await updateIssue({
      domain,
      auth,
      issueKey,
      issueData
    });

    expect(response).toEqual(expectedResponse);

    expect(fetchMock).toHaveBeenCalledWith(
      `https://${domain}/rest/api/3/issue/AT-5?returnIssue=true`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en',
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
          'User-Agent': 'monorepo-jira-release-github-action/1.0.0'
        },
        body: JSON.stringify({ update: issueData })
      }
    );
  });
});
