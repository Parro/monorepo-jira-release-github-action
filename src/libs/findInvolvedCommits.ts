import * as core from '@actions/core';

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

  if (beforeTag !== undefined) {
    if (beforeTag === currentTag) {
      return findInvolvedCommits({
        client,
        owner,
        repo,
        currentTag,
        tagsList
      });
    }

    const tagsCompared = await compareTags({
      client,
      owner,
      repo,
      currentTag: beforeTag,
      previousTag: currentTag
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

    core.debug(`🚀 ~ involved commits: ${commits}`);
    if (commits.length > 0) {
      return commits;
    }

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
