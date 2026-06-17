import { GetAtlassianAuthentication } from './types';

const getAtlassianAuthentication: GetAtlassianAuthentication = ({
  email,
  token
}) => {
  return Buffer.from(`${email}:${token}`).toString('base64');
};

export default getAtlassianAuthentication;
