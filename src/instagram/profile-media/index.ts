import { Cache } from '../../cache';
import { GuestAuthentication } from '../authenticate';
import { ProfileMedia, ApiResponse } from './types';
import { Profile } from '../profile';

import { getByApi } from './get-by-api';
import { parseApiResponse } from './parse-api-response';

const cache = new Cache('profile-media');

export * from './types/profile-media';

export async function getProfileMedia(
  auth: GuestAuthentication,
  profile: Profile,
  useCache: boolean
): Promise<ProfileMedia[]> {
  console.log('Getting media for:', profile.username);
  const result: ProfileMedia[] = [];

  let endCursor: string | undefined = undefined;
  do {
    console.log('  Page:', endCursor || 'first');
    const { response, shouldUpdateCache } = await get(auth, profile, endCursor, useCache) as GetResult;

    console.log('    Parsing response');
    const parsed = await parseApiResponse(response);

    // Only when all of the validation succeeded we can cache the value
    // We have to do before assigning 'endCursor'!
    if (useCache && shouldUpdateCache) {
      const cacheKey = createCacheKey(profile, endCursor);
      await cache.put(cacheKey, JSON.stringify(response));
    }

    parsed.media.forEach(m => result.push(m));
    endCursor = parsed.endCursor; // To actually finish our loop
  } while (endCursor != undefined);

  return result;
}

interface GetResult {
  readonly response: ApiResponse.Root;
  readonly shouldUpdateCache: boolean;
}

async function get(
  auth: GuestAuthentication,
  profile: Profile,
  endCursor: string | undefined,
  useCache: boolean
): Promise<GetResult> {
  if (useCache) {
    const cacheKey = createCacheKey(profile, endCursor);
    const string = await cache.get(cacheKey);
    if (string) {
      console.log('    Found cached response');
      const response = JSON.parse(string) as ApiResponse.Root;
      return { response, shouldUpdateCache: false };
    }
  }

  console.log('    Requesting by api');
  try {
    const response = await getByApi(auth, profile, endCursor);
    return { response, shouldUpdateCache: true };
  } catch (error) {
    console.log(`    ${error}`);
    throw error;
  }
}

function createCacheKey(profile: Profile, endCursor: string | undefined) {
  const cacheKeyCursor = endCursor == undefined ? '' : '_' + endCursor;
  const cacheKey = `${profile.username}${cacheKeyCursor}.json`;
  return cacheKey;
}
