import createRelease from './create-release';

jest.mock('./create-release', () => ({
  __esModule: true,
  default: jest.fn()
}));

const createReleaseMocked = jest.mocked(createRelease);

export { createReleaseMocked };
