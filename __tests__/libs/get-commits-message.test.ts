import { describe, it, expect } from '@jest/globals';

import getCommitsMessage from '../../src/libs/get-commits-message';

describe('getCommitsMessage tests', () => {
  it('should get tasks codes and text messages form commits', async () => {
    const jiraProjectKey = 'AT';
    const commits = [
      {
        oid: 'd489a854c17a464e4248de30ccb019bf4952bea2',
        message: 'Malformed commit'
      },
      {
        oid: 'c6dcce7574a419ff5aabb3749aa5df9e7b31f5b9',
        message: 'AT-5 feat: Edit for first task'
      },
      {
        oid: '1c07bfe0b25e88e309674a3bbca4cc31b78ee7e4',
        message:
          'Merge pull request #1 from Owner/feature/AT-5-edits\n\nFeature/at 5 edits'
      },
      {
        oid: '7fcd98e44beb66a38e13a426dde6d432a93375e1',
        message: 'AT-6 feat: Important edits for second task'
      },
      {
        oid: '1e1ebcd6fc425d95ac2b8d8a230a0f360d89f22b',
        message: 'AT-6 refactor: More stuff'
      },
      {
        oid: 'ff4858dba95b4087d60cec294e52a665286d97fc',
        message:
          'Merge pull request #2 from Owner/feature/AT-6-important-edits-for-main-feature\n\nAT-6 feat: Important edits for second task'
      }
    ];

    const expectedResponse = {
      tasks: ['AT-5', 'AT-6'],
      descriptions: [
        'Edit for first task',
        'Important edits for second task',
        'More stuff'
      ]
    };

    const response = getCommitsMessage({
      jiraProjectKey,
      commits
    });

    expect(response).toEqual(expectedResponse);
  });
});
