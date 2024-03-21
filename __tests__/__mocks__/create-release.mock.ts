import createRelease from '../../src/libs/create-release';

jest.mock('../../src/libs/create-release', () => ({
  __esModule: true,
  default: jest.fn()
}));

const createReleaseMocked = jest.mocked(createRelease);

export { createReleaseMocked };
