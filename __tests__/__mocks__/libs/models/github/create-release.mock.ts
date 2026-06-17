import { jest } from '@jest/globals';

import createRelease from '../../../../../src/libs/models/github/create-release';

jest.mock('../../../../../src/libs/models/github/create-release', () => ({
  __esModule: true,
  default: jest.fn()
}));

const createReleaseMocked = jest.mocked(createRelease);

export { createReleaseMocked };
