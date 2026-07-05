export type ProjectVersion = {
  archived: boolean;
  description: string;
  driver?: string;
  id: string;
  expand?: string;
  moveUnfixedIssuesTo?: string;
  name: string;
  projectId: number;
  releaseDate: string;
  released: boolean;
  self?: string;
  startDate?: string;
  userReleaseDate?: string;
};

export type ProjectVersionPostRequest = Pick<
  ProjectVersion,
  'name' | 'description' | 'projectId' | 'releaseDate'
>;

export type CreateProjectVersion = (args: {
  domain: string;
  auth: string;
  version: ProjectVersionPostRequest;
}) => Promise<ProjectVersion>;

export type GetAtlassianAuthentication = (args: {
  email: string;
  token: string;
}) => string;
