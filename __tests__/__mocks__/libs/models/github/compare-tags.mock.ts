import { jest } from '@jest/globals';

import compareTags from '../../../../../src/libs/models/github/compare-tags';

jest.mock('../../../../../src/libs/models/github/compare-tags', () => ({
  __esModule: true,
  default: jest.fn()
}));

const compareTagsMocked = jest.mocked(compareTags);

export { compareTagsMocked };
