export type IssueFieldUpdateOperation =
  | { set: unknown }
  | { add: unknown }
  | { remove: unknown }
  | { edit: unknown }
  | { copy: unknown };
export type IssueFieldsUpdate = Record<string, unknown>;
export type IssueFieldUpdateMap = Record<
  string,
  IssueFieldUpdateOperation[]
> & {
  [key: string]: IssueFieldUpdateOperation[] | unknown;
};

export interface IssueUpdate {
  // TODO not all possible valid REST properties are mapped here
  fields?: IssueFieldsUpdate;
  update?: IssueFieldUpdateMap;
}

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

export type UpdateIssueRequest = IssueFieldUpdateMap;
export type UpdateIssueResponse = {
  expand: string;
  id: string;
  self: string;
  key: string;
  names: Record<string, string>;
  fields: Record<string, object[]>;
};

export type UpdateIssue = (args: {
  domain: string;
  auth: string;
  issueKey: string;
  issueData: UpdateIssueRequest;
}) => Promise<UpdateIssueResponse>;
