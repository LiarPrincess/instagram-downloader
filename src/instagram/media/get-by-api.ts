import { ApiResponse, GetMediaError } from './types';
import { GuestAuthentication } from '../authenticate';
import { getJSON, waitAfterMediaRequestToPreventBan } from '../common';

export async function getByApi(
  auth: GuestAuthentication,
  shortCode: string
): Promise<ApiResponse.Root> {
  try {
    const url = `https://www.instagram.com/p/${shortCode}/?__a=1`;
    const response = await getJSON(auth, url) as ApiResponse.Root;
    await waitAfterMediaRequestToPreventBan();
    return response;
  } catch (error) {
    const statusCode = error.statusCode || (error.response && error.response.status);
    if (statusCode == 404) {
      throw new GetMediaError({ kind: 'MissingMedia' });
    }

    throw error;
  }
}
