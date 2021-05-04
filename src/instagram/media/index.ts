import { Cache } from '../../cache';
import { GuestAuthentication } from '../authenticate';
import { Media, ApiResponse, PrivateProfileError } from './types';

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
  const response = await get(auth, shortCode, useCache);

  console.log('  Parsing response');
  const result = parseApiResponse(response);

  // Only when all of the validation succeded we can cache the value
  const cacheKey = createCacheKey(shortCode);
  await cache.put(cacheKey, JSON.stringify(response));
  return result;
}

async function get(
  auth: GuestAuthentication,
  shortCode: string,
  useCache: boolean
): Promise<ApiResponse.Root> {
  if (useCache) {
    const cacheKey = createCacheKey(shortCode);
    const string = await cache.get(cacheKey);
    if (string) {
      console.log('  Found cached response');
      const result = JSON.parse(string);
      return result;
    }
  }

  const errors: Error[] = [];

  console.log('  Requesting by api');
  try {
    const response = await getByApi(auth, shortCode);
    return response;
  } catch (error) {
    console.log(`    ${error}`);
    errors.push(error);
  }

  console.log('  Using browser __initialData');
  try {
    const response = await getByBrowser__initialData(shortCode, useCache);
    return response;
  } catch (error) {
    console.log(`    ${error}`);
    errors.push(error);
  }

  console.log('  Using browser _sharedDataError');
  try {
    const response = await getByBrowser_sharedData(shortCode, useCache);
    return response;
  } catch (error) {
    console.log(`    ${error}`);
    errors.push(error);
  }

  for (const error of errors) {
    if (error instanceof PrivateProfileError) {
      throw error;
    }
  }

  throw new Error('All possible methods to get media failed.');
}

function createCacheKey(shortCode: string): string {
  return shortCode + '.json';
}