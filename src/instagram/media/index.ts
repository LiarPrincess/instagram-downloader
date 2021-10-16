import { Cache } from '../../cache';
import { GuestAuthentication } from '../authenticate';
import { Media, ApiResponse, GetMediaError } from './types';

import { getByApi } from './get-by-api';
import { getByBrowser__initialData, getByBrowser_sharedData } from './get-by-browser';
import { parseApiResponse } from './parse-api-response';

const cache = new Cache('media');

export * from './types/media';
export * from './types/errors';

export async function getMedia(
  auth: GuestAuthentication,
  shortCode: string,
  useCache: boolean
): Promise<Media> {
  console.log('Getting media:', shortCode);
  const { response, shouldUpdateCache } = await get(auth, shortCode, useCache);

  console.log('  Parsing response');
  const result = parseApiResponse(response);

  // Only when all of the validation succeeded we can cache the value
  if (useCache && shouldUpdateCache) {
    const cacheKey = createCacheKey(shortCode);
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
  shortCode: string,
  useCache: boolean
): Promise<GetResult> {
  if (useCache) {
    const cacheKey = createCacheKey(shortCode);
    const string = await cache.get(cacheKey);
    if (string) {
      console.log('  Found cached response');
      const response = JSON.parse(string) as ApiResponse.Root;
      return { response, shouldUpdateCache: false };
    }
  }

  const errors: Error[] = [];
  function handleError(error: Error) {
    console.log(`    ${error}`);

    if (error instanceof GetMediaError && error.allFollowingRequestsWillAlsoFail) {
      throw error;
    }

    errors.push(error);
  }

  console.log('  Requesting by api');
  try {
    const response = await getByApi(auth, shortCode);
    return { response, shouldUpdateCache: true };
  } catch (error) {
    handleError(error);
  }

  console.log('  Using browser __initialData');
  try {
    const response = await getByBrowser__initialData(shortCode, useCache);
    return { response, shouldUpdateCache: true };
  } catch (error) {
    handleError(error);
  }

  console.log('  Using browser _sharedDataError');
  try {
    const response = await getByBrowser_sharedData(shortCode, useCache);
    return { response, shouldUpdateCache: true };
  } catch (error) {
    handleError(error);
  }

  const getMediaError = errors.find(e => e instanceof GetMediaError);
  throw getMediaError || new GetMediaError({ kind: 'Unknown' });
}

function createCacheKey(shortCode: string): string {
  return shortCode + '.json';
}
