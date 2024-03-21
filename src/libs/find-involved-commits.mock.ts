import findInvolvedCommits from './find-involved-commits';

jest.mock('./find-involved-commits', () => ({
  __esModule: true,
  default: jest.fn()
}));

const findInvolvedCommitsMocked = jest.mocked(findInvolvedCommits);

export { findInvolvedCommitsMocked };
