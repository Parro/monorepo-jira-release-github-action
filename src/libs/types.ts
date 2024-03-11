import type { graphql, GraphQlQueryResponseData } from '@octokit/graphql';

export type CompareTags = (args: {
  client: typeof graphql;
  owner: string;
  repo: string;
  beforeTag: string;
  lastTag: string;
}) => Promise<GraphQlQueryResponseData>;

export type FindInvolvedCommits = (args: {
  client: typeof graphql;
  owner: string;
  repo: string;
  currentTag: string;
  tagsList: Array<string>;
}) => Promise<void>;

export type GetLastTags = (args: {
  client: typeof graphql;
  owner: string;
  repo: string;
  first: number;
}) => Promise<GraphQlQueryResponseData>;
