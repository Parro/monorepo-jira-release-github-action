import { jest } from '@jest/globals';

import createProjectVersion from '../../../../../src/libs/models/jira/create-project-version';

jest.mock('../../../../../src/libs/models/jira/create-project-version', () => ({
  __esModule: true,
  default: jest.fn()
}));

const createProjectVersionMocked = jest.mocked(createProjectVersion);

export { createProjectVersionMocked };
