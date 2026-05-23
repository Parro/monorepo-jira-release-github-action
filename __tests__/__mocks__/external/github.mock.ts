import * as github from '@actions/github';

jest.mock('@actions/github', () => ({
  context: {
    payload: {
      pull_request: {
        number: 1
      }
    },
    repo: {
      owner: 'owner',
      repo: 'repo'
    }
  },
  getOctokit: jest.fn()
}));

const githubMocked = jest.mocked(github);
const getOctokitMocked = jest.mocked(github.getOctokit);

export { githubMocked, getOctokitMocked };
