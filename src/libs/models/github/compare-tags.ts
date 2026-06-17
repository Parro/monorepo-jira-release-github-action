import { CompareTags } from './types';

const compareTags: CompareTags = async ({
  client,
  owner,
  repo,
  currentTag,
  previousTag
}) => {
  const query = `
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
`;
  return client(query, {
    owner,
    repo,
    currentTag,
    previousTag
  });
};

export default compareTags;
