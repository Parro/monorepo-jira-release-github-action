import findInvolvedCommits from '../../src/libs/findInvolvedCommits';

jest.mock('../../src/libs/findInvolvedCommits', () => ({
  __esModule: true,
  default: jest.fn()
}));

const findInvolvedCommitsMocked = jest.mocked(findInvolvedCommits);

export { findInvolvedCommitsMocked };
