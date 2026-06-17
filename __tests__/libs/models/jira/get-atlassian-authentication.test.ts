import { describe, it, expect } from '@jest/globals';

import getAtlassianAuthentications from '../../../../src/libs/models/jira/get-atlassian-authentication';

describe('getAtlassianAuthentication tests', () => {
  it('should get Atlassian authentication token', async () => {
    const email = 'user@example.com';
    const token = 'abc123';

    const expectedResponse = 'dXNlckBleGFtcGxlLmNvbTphYmMxMjM=';

    const response = getAtlassianAuthentications({
      email,
      token
    });

    expect(response).toEqual(expectedResponse);
  });
});
