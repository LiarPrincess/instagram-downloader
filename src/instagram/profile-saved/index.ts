import { Cache } from '../../cache';
import { BrowserAuthentication } from '../authenticate';
import { SavedMedia, ApiResponse } from './types';
import { Profile } from '../profile';

import { getByApi } from './get-by-api';
import { parseApiResponse } from './parse-api-response';

const cache = new Cache('profile-saved');

export * from './types/saved-media';

export async function getSavedMedia(
  auth: BrowserAuthentication,
  profile: Profile,
  useCache: boolean,
  stopAtShortCodes: string[] = []
): Promise<SavedMedia[]> {
  console.log('Getting saved media for:', profile.username);
  const result: SavedMedia[] = [];

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

    let hasArrivedToStopShortCode = false;
    for (const media of parsed.media) {
      result.push(media);

      const isStop = stopAtShortCodes.includes(media.shortCode);
      hasArrivedToStopShortCode = hasArrivedToStopShortCode || isStop;
    }

    // To actually finish our loop
    endCursor = hasArrivedToStopShortCode ? undefined : parsed.endCursor;
  } while (endCursor != undefined);

  return result;
}

interface GetResult {
  readonly response: ApiResponse.Root;
  readonly shouldUpdateCache: boolean;
}

async function get(
  auth: BrowserAuthentication,
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

