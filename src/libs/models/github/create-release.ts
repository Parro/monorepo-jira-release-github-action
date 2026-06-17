import { CreateRelease } from './types';

const createRelease: CreateRelease = async ({
  client,
  owner,
  repo,
  name,
  tagName,
  body,
  draft = true
}) => {
  return client.repos.createRelease({
    owner,
    repo,
    tag_name: tagName,
    body,
    name,
    draft
  });
};

export default createRelease;
