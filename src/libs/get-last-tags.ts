import type { GetLastTags } from './types';

const getLastTags: GetLastTags = async ({ client, owner, repo, first }) => {
  const query = `
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
`;

  return client(query, {
    owner,
    repo,
    first
  });
};

export default getLastTags;
