import type { graphql } from '@octokit/graphql';

export type Commit = { oid: string; message: string };

export type FindInvolvedCommits = (args: {
  client: typeof graphql;
  owner: string;
  repo: string;
  currentTag: string;
  tagsList: string[];
}) => Promise<Commit[]>;

export type GetCommitsMessage = (args: {
  jiraProjectKey: string;
  commits: Commit[];
}) => { tasks: string[]; descriptions: string[] };

export type RegExpGroups<T extends string[]> =
  | (RegExpMatchArray & {
      groups?: { [name in T[number]]: string } | { [key: string]: string };
    })
  | null;
