import { jest } from '@jest/globals';

import updateIssue from '../../../../../src/libs/models/jira/update-issue';

jest.mock('../../../../../src/libs/models/jira/update-issue', () => ({
  __esModule: true,
  default: jest.fn()
}));

const updateIssueMocked = jest.mocked(updateIssue);

export { updateIssueMocked };
