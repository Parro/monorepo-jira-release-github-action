import compareTags from './compare-tags';

jest.mock('./compare-tags', () => ({
  __esModule: true,
  default: jest.fn()
}));

const compareTagsMocked = jest.mocked(compareTags);

export { compareTagsMocked };
