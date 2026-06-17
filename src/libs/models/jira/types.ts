export type ProjectVersion = {
  archived: boolean;
  description: string;
  driver: string;
  expand: string;
  moveUnfixedIssuesTo: string;
  name: string;
  projectId: number;
  releaseDate: string;
  released: boolean;
  startDate: string;
};

export type ProjectVersionPostRequest = Pick<
  ProjectVersion,
  'name' | 'description' | 'projectId' | 'releaseDate'
>;

export type CreateProjectVersion = (args: {
  domain: string;
  auth: string;
  version: ProjectVersionPostRequest;
}) => Promise<void>;


export type GetAtlassianAuthentication = (args: {
  email: string;
  token: string;
}) => string;