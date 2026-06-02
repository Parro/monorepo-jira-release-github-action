import { GetCommitsMessage, RegExpGroups } from './types';

const getCommitsMessage: GetCommitsMessage = ({ jiraProjectKey, commits }) => {
  const response = commits.reduce<{ tasks: string[]; descriptions: string[] }>(
    (acc, commit) => {
      const matches: RegExpGroups<['action', 'description']> =
        commit.message.match(
          new RegExp(
            `(?<task>${jiraProjectKey}-[0-9]+) (?<action>.*): (?<description>.*)`
          )
        );

      if (matches === null) {
        return acc;
      }

      const task = matches.groups?.task;
      const description = matches.groups?.description;
      if (task !== undefined && acc.tasks.includes(task) === false) {
        acc.tasks.push(task);
      }
      if (
        description !== undefined &&
        acc.descriptions.includes(description) === false
      ) {
        acc.descriptions.push(description);
      }

      return acc;
    },
    { tasks: [], descriptions: [] }
  );

  return response;
};

export default getCommitsMessage;
