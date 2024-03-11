import type { graphql, GraphQlQueryResponseData } from '@octokit/graphql';

export type CompareTags = (args: {
  client: typeof graphql;
  owner: string;
  repo: string;
  beforeTag: string;
  lastTag: number;
}) => Promise<GraphQlQueryResponseData>;

export type GetLastTags = (args: {
  client: typeof graphql;
  owner: string;
  repo: string;
  limit: number;
}) => Promise<GraphQlQueryResponseData>;
