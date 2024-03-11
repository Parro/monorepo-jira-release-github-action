import compareTags from './compareTags';

import type { FindInvolvedCommits } from './types';

const findInvolvedCommits: FindInvolvedCommits = async ({
  client,
  owner,
  repo,
  currentTag,
  tagsList
}) => {
  const beforeTag = tagsList.shift();
  console.log('🚀 ~ currentTag:', currentTag);
  console.log('🚀 ~ beforeTag:', beforeTag);

  if (beforeTag !== undefined) {
    const tagsCompared = await compareTags({
      client,
      owner,
      repo,
      beforeTag,
      lastTag: currentTag
    });

    const {
      repository: {
        ref: {
          compare: {
            commits: { nodes: commits }
          }
        }
      }
    } = tagsCompared;

    console.log('🚀 ~ commits:', commits);
    if (commits.length > 0) {
      return commits;
    }

    console.log('🚀 ~ currentTag recursive:', currentTag);
    return findInvolvedCommits({
      client,
      owner,
      repo,
      currentTag,
      tagsList
    });
  }
};

export default findInvolvedCommits;
