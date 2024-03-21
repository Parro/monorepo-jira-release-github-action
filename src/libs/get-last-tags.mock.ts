import getLastTags from './get-last-tags';

jest.mock('./get-last-tags', () => ({
  __esModule: true,
  default: jest.fn()
}));

const getLastTagsMocked = jest.mocked(getLastTags);

export { getLastTagsMocked };
