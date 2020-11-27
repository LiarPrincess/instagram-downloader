import { promises as fs } from 'fs';
import { default as axios } from 'axios';

import { Profile } from './profile';
import { BrowserAuthentication } from './authenticate';
import { UserSavedResponse } from './response-types/user-saved';
import { getJSON, parseTimestamp, waitAfterRequestToPreventBan, seconds } from './common';
import { Cache } from '../cache';
import { join } from 'path';
import { getProfile } from './profile';

const cache = new Cache('user-saved');

export interface Result {
}

export async function getSaved(auth: BrowserAuthentication, username: string, useCache: boolean): Promise<Result[]> {
  console.log('Getting saved media for:', username);
  console.log('  Getting user profile');
  const profile = await getProfile(auth, username, true);

  const result: Result[] = [];

  let endCursor: string | undefined = undefined;
  do {
    console.log('  Page:', endCursor || 'first');
    const response = await get(auth, profile, endCursor, useCache) as UserSavedResponse;
    const mediaPage = response.data.user.edge_saved_media;

    console.log('    Parsing response');
    // for (const edge of mediaPage.edges) {
    // }

    const page = mediaPage.page_info;
    endCursor = page.has_next_page ? page.end_cursor : undefined;
    throw 'DO NOT REQUEST NEXT PAGES!';
  } while (endCursor != undefined);

  return result;
}

// TODO: https://www.instagram.com/liarprincesss/saved/?__a=1

async function get(
  auth: BrowserAuthentication,
  profile: Profile,
  endCursor: string | undefined,
  useCache: boolean
): Promise<UserSavedResponse> {
  const cacheKeyCursor = endCursor == undefined ? '' : '_' + endCursor;
  const cacheKey = `${profile.username}${cacheKeyCursor}.json`;

  // if (useCache) {
  //   const string = await cache.get(cacheKey);
  //   if (string) {
  //     console.log('    Found cached response');
  //     const result = JSON.parse(string);
  //     return result;
  //   }
  // }

  const after = endCursor == undefined ? 'null' : `"${endCursor}"`;
  const params = `{"id":"${profile.id}","first":50,"after":${after}}`;
  const url = `https://www.instagram.com/graphql/query/?query_hash=2ce1d673055b99250e93b6f88f878fde&variables=${params}`;

  const cookies = [
    `csrftoken=${auth.csrfToken}`,
    // `ds_user_id=${profile.id}`, // not needed
    `sessionid=${auth.sessionId}`
  ];

  console.log('    Requesting page');
  const response = await axios.get(url, {
    headers: {
      'Referer': `https://www.instagram.com/${profile.username}/saved/`,
      'Cookie': cookies.join('; '),
      'X-IG-App-ID': '936619743392459',
      'X-CSRFToken': auth.csrfToken
    }
  });

  const data = response.data;
  await cache.put(cacheKey, JSON.stringify(data));
  await waitAfterRequestToPreventBan(2 * seconds);

  return data;
}
