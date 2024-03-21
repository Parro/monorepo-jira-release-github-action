import * as core from '@actions/core';

jest.mock('@actions/core', () => ({
  debug: jest.fn(),
  getInput: jest.fn(),
  setOutput: jest.fn()
}));

const debugMocked = jest.mocked(core.debug);
const getInputMocked = jest.mocked(core.getInput);
const setOutputMocked = jest.mocked(core.setOutput);

export { debugMocked, getInputMocked, setOutputMocked };
