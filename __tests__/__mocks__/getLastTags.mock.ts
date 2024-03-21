import getLastTags from '../../src/libs/getLastTags';

jest.mock('../../src/libs/getLastTags', () => ({
  __esModule: true,
  default: jest.fn()
}));

const getLastTagsMocked = jest.mocked(getLastTags);

export { getLastTagsMocked };
