import getLastTags from '../../src/libs/get-last-tags';

jest.mock('../../src/libs/get-last-tags', () => ({
  __esModule: true,
  default: jest.fn()
}));

const getLastTagsMocked = jest.mocked(getLastTags);

export { getLastTagsMocked };
