import type { GetLastTags } from './types';

const getLastTags: GetLastTags = async ({ client, owner, repo, first }) => {
  return client(
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
};

export default getLastTags;
