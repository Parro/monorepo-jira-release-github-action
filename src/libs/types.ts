import type { graphql, GraphQlQueryResponseData } from '@octokit/graphql';
import type { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import type { Endpoints } from '@octokit/types';

export type Commit = { oid: string; message: string };

export type CompareTags = (args: {
  client: typeof graphql;
  owner: string;
  repo: string;
  currentTag: string;
  previousTag: string;
}) => Promise<GraphQlQueryResponseData>;

export type CreateRelease = (args: {
  client: Api['rest'];
  owner: string;
  repo: string;
  tagName: string;
  name: string;
  body: string;
  draft?: boolean;
}) => Promise<Endpoints['POST /repos/{owner}/{repo}/releases']['response']>;

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

export type GetLastTags = (args: {
  client: typeof graphql;
  owner: string;
  repo: string;
  first: number;
}) => Promise<GraphQlQueryResponseData>;

export type RegExpGroups<T extends string[]> =
  | (RegExpMatchArray & {
      groups?: { [name in T[number]]: string } | { [key: string]: string };
    })
  | null;
