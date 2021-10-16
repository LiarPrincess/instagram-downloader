import { Cache } from '../../cache';
import { GuestAuthentication } from '../authenticate';
import { Profile, ApiResponse } from './types';

import { getByApi } from './get-by-api';
import { parseApiResponse } from './parse-api-response';

const cache = new Cache('profile');

export * from './types/profile';

export async function getProfile(
  auth: GuestAuthentication,
  username: string,
  useCache: boolean
): Promise<Profile> {
  console.log('Getting profile:', username);
  const { response, shouldUpdateCache } = await get(auth, username, useCache);

  console.log('  Parsing response');
  const result = parseApiResponse(response);

  // Only when all of the validation succeeded we can cache the value
  if (useCache && shouldUpdateCache) {
    const cacheKey = createCacheKey(username);
    await cache.put(cacheKey, JSON.stringify(response));
  }

  return result;
}

interface GetResult {
  readonly response: ApiResponse.Root;
  readonly shouldUpdateCache: boolean;
}

async function get(
  auth: GuestAuthentication,
  username: string,
  useCache: boolean
): Promise<GetResult> {
  if (useCache) {
    const cacheKey = createCacheKey(username);
    const string = await cache.get(cacheKey);
    if (string) {
      console.log('  Found cached response');
      const response = JSON.parse(string) as ApiResponse.Root;
      return { response, shouldUpdateCache: false };
    }
  }

  console.log('  Requesting by api');
  try {
    const response = await getByApi(auth, username);
    return { response, shouldUpdateCache: true };
  } catch (error) {
    console.log(`    ${error}`);
    throw error;
  }
}

function createCacheKey(username: string): string {
  return username + '.json';
}
