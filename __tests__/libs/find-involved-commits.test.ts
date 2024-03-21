import { compareTagsMocked } from '../../src/libs/compare-tags.mock';

import findInvolvedCommits from '../../src/libs/find-involved-commits';

import type { graphql } from '@octokit/graphql';

describe('findInvolvedCommits tests', () => {
  it('should get the commits happened between the current tag and the previous release', async () => {
    const client = jest.fn() as unknown as typeof graphql;
    const owner = 'owner';
    const repo = 'repo';
    const currentTag = '@second-package@0.3.0';
    const tagsList = [
      '@second-package@0.3.0',
      '@first-package@0.3.0',
      '@second-package@0.2.0',
      '@second-package@0.1.0',
      '@first-package@0.2.0',
      '@first-package@0.1.0'
    ];

    compareTagsMocked.mockResolvedValueOnce({
      repository: {
        ref: {
          compare: {
            commits: { nodes: [] }
          }
        }
      }
    });
    compareTagsMocked.mockResolvedValueOnce({
      repository: {
        ref: {
          compare: {
            commits: {
              nodes: [
                {
                  oid: '3b34067b66a550f8c536fda2825c8103f8cbc0bb',
                  message: 'Last commit'
                }
              ]
            }
          }
        }
      }
    });

    const expectedResponse = [
      {
        oid: '3b34067b66a550f8c536fda2825c8103f8cbc0bb',
        message: 'Last commit'
      }
    ];

    const response = await findInvolvedCommits({
      client,
      owner,
      repo,
      currentTag,
      tagsList
    });

    expect(response).toEqual(expectedResponse);

    expect(compareTagsMocked).toHaveBeenCalledTimes(2);
    expect(compareTagsMocked).toHaveBeenNthCalledWith(1, {
      client,
      owner,
      repo,
      currentTag: '@first-package@0.3.0',
      previousTag: '@second-package@0.3.0'
    });
    expect(compareTagsMocked).toHaveBeenNthCalledWith(2, {
      client,
      owner,
      repo,
      currentTag: '@second-package@0.2.0',
      previousTag: '@second-package@0.3.0'
    });
  });
});
