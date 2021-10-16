import { Cache } from '../cache';

const cache = new Cache('helpers');
const cacheKey = 'known-unavailable-media.txt';

export async function isKnownUnavailableMedia(shortCode: string): Promise<boolean> {
  const unavailableShortCodes = await getUnavailableShortCodes();
  const result = unavailableShortCodes.has(shortCode);
  return result;
}

export async function markMediaAsUnavailable(shortCode: string) {
  const unavailableShortCodes = await getUnavailableShortCodes();
  unavailableShortCodes.add(shortCode);

  let cacheValue = '';
  for (const code of unavailableShortCodes) {
    cacheValue += code + '\n';
  }

  cache.put(cacheKey, cacheValue);
}

let _shortCodes: Set<string> | undefined;
async function getUnavailableShortCodes(): Promise<Set<string>> {
  if (_shortCodes) {
    return _shortCodes;
  }

  const result = new Set<string>();
  const cached = await cache.get(cacheKey);

  if (cached) {
    for (const l of cached.split('\n')) {
      const line = l.trim();
      if (line.length != 0)
        result.add(line);
    }
  }

  _shortCodes = result;
  return result;
}
