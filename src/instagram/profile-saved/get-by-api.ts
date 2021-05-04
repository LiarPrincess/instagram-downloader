import { default as axios } from 'axios';

import { ApiResponse } from './types';
import { Profile } from '../profile';
import { BrowserAuthentication } from '../authenticate';
import { waitAfterSavedMediaRequestToPreventBan } from '../common';

export async function getByApi(
  auth: BrowserAuthentication,
  profile: Profile,
  endCursor: string | undefined
): Promise<ApiResponse.Root> {
  // There is also 'https://www.instagram.com/USERNAME/saved/?__a=1' if this fails.
  const after = endCursor == undefined ? 'null' : `"${endCursor}"`;
  const params = `{"id":"${profile.id}","first":50,"after":${after}}`;
  const url = `https://www.instagram.com/graphql/query/?query_hash=2ce1d673055b99250e93b6f88f878fde&variables=${params}`;

  const cookies = [
    `csrftoken=${auth.csrfToken}`,
    // `ds_user_id=${profile.id}`, // not needed
    `sessionid=${auth.sessionId}`
  ];

  const response = await axios.get(url, {
    headers: {
      'Referer': `https://www.instagram.com/${profile.username}/saved/`,
      'Cookie': cookies.join('; '),
      'X-IG-App-ID': '936619743392459',
      'X-CSRFToken': auth.csrfToken
    }
  });

  await waitAfterSavedMediaRequestToPreventBan();
  return response.data;
}
