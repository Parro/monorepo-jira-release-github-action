import type { GetLastTags } from './types';

const getLastTags: GetLastTags = async ({ client, owner, repo, limit }) => {
  return client(
    `
      query ($owner: String!, $repo: String!, $last: Int) {
        repository(owner: $owner, name: $repo) {
          refs(refPrefix: "refs/tags/", last: $last, orderBy: {field: TAG_COMMIT_DATE, direction: DESC}) {
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
      last: limit
    }
  );
};

export default getLastTags;
