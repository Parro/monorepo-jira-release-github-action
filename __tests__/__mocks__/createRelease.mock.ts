import createRelease from '../../src/libs/createRelease';

jest.mock('../../src/libs/createRelease', () => ({
  __esModule: true,
  default: jest.fn()
}));

const createReleaseMocked = jest.mocked(createRelease);

export { createReleaseMocked };
