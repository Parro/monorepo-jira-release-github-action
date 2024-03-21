import compareTags from '../../src/libs/compareTags';

import type { graphql } from '@octokit/graphql';

describe('compareTags tests', () => {
  it('should get the list of commits comparing two tags', async () => {
    const client = jest.fn() as unknown as typeof graphql;
    const owner = 'owner';
    const repo = '';
    const currentTag = '@first-package@0.1.0';
    const previousTag = '@first-package@0.2.0';

    await compareTags({ client, owner, repo, currentTag, previousTag });

    expect(client).toHaveBeenCalledWith(
      `
query ($owner: String!, $repo: String!, $currentTag: String!, $previousTag: String!) {
  repository(owner: $owner, name: $repo) {
    ref(qualifiedName: $currentTag) {
      compare(headRef: $previousTag) {
        commits(first: 100) {
          nodes {
            oid,
            message
          }
        }
      }
    }
  }
}
`,
      {
        owner,
        repo,
        currentTag,
        previousTag
      }
    );
  });
});
