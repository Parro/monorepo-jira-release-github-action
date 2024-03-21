import getLastTags from '../../src/libs/getLastTags';

import { graphql } from '@octokit/graphql';

describe('getLastTags tests', () => {
  it('should get the last repository tags', async () => {
    const client = jest.fn() as unknown as typeof graphql;
    const owner = 'owner';
    const repo = 'repo';
    const first = 50;

    await getLastTags({ client, owner, repo, first });

    expect(client).toHaveBeenCalledWith(
      `
query ($owner: String!, $repo: String!, $first: Int) {
  repository(owner: $owner, name: $repo) {
    refs(refPrefix: "refs/tags/", first: $first, orderBy: {field: TAG_COMMIT_DATE, direction: DESC}) {
      edges {
        node {
          name
        }
      }
    }
  }
}
`,
      {
        owner,
        repo,
        first
      }
    );
  });
});
