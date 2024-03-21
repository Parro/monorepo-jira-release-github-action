import findInvolvedCommits from '../../src/libs/find-involved-commits';

jest.mock('../../src/libs/find-involved-commits', () => ({
  __esModule: true,
  default: jest.fn()
}));

const findInvolvedCommitsMocked = jest.mocked(findInvolvedCommits);

export { findInvolvedCommitsMocked };
