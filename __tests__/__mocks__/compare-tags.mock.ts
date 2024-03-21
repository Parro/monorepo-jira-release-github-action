import compareTags from '../../src/libs/compare-tags';

jest.mock('../../src/libs/compare-tags', () => ({
  __esModule: true,
  default: jest.fn()
}));

const compareTagsMocked = jest.mocked(compareTags);

export { compareTagsMocked };
