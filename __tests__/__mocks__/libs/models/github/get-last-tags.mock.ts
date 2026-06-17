import { jest } from '@jest/globals';

import getLastTags from '../../../../../src/libs/models/github/get-last-tags';

jest.mock('../../../../../src/libs/models/github/get-last-tags', () => ({
  __esModule: true,
  default: jest.fn()
}));

const getLastTagsMocked = jest.mocked(getLastTags);

export { getLastTagsMocked };
