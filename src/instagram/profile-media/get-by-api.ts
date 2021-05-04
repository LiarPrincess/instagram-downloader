import { ApiResponse } from './types';
import { Profile } from '../profile';
import { GuestAuthentication } from '../authenticate';
import { getJSON, waitAfterProfileMediaRequestToPreventBan } from '../common';

export async function getByApi(
  auth: GuestAuthentication,
  profile: Profile,
  endCursor: string | undefined
): Promise<ApiResponse.Root> {
  const after = endCursor == undefined ? 'null' : `"${endCursor}"`;
  const params = `{"id":"${profile.id}","first":50,"after":${after}}`;
  const url = `https://www.instagram.com/graphql/query/?query_hash=42323d64886122307be10013ad2dcc44&variables=${params}`;
  const gisData = params;

  const response = await getJSON(auth, url, gisData);
  await waitAfterProfileMediaRequestToPreventBan();
  return response;
}
