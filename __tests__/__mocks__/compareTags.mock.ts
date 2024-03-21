import compareTags from '../../src/libs/compareTags';

jest.mock('../../src/libs/compareTags', () => ({
  __esModule: true,
  default: jest.fn()
}));

const compareTagsMocked = jest.mocked(compareTags);

export { compareTagsMocked };
