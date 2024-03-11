import { CompareTags } from './types';

const compareTags: CompareTags = async ({
  client,
  owner,
  repo,
  beforeTag,
  lastTag
}) => {
  return client(
    `
      query ($owner: String!, $repo: String!, $beforeTag: String!, $lastTag: String!) {
        repository(owner: $owner, name: $repo) {
          ref(qualifiedName: $beforeTag) {
            compare(headRef: $lastTag) {
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
      beforeTag: beforeTag,
      lastTag: lastTag
    }
  );
};

export default compareTags;
