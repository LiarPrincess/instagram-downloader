import { GuestAuthentication } from '../authenticate';
import { ApiResponse } from './types';
import { getJSON, waitAfterProfileRequestToPreventBan } from '../common';

export async function getByApi(
  auth: GuestAuthentication,
  username: string
): Promise<ApiResponse.Root> {
  const url = `https://www.instagram.com/${username}/?__a=1`;
  const response = await getJSON(auth, url);
  await waitAfterProfileRequestToPreventBan();
  return response;
}
