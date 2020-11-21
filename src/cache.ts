import { join } from 'path';
import { Stream } from 'stream';
import { default as axios } from 'axios';
import { promises as fs, createWriteStream } from 'fs';

/* ============== */
/* === Config === */
/* ============== */

const encoding = 'utf8';

const cachePath = join('.', 'cache');

const forbiddenKeyCharacters = new Set(['/', '\\', '?', ':', '#']);
function createFilePath(key: string): string {
  let escaped = '';

  for (const char of key) {
    if (!forbiddenKeyCharacters.has(char)) {
      escaped += char;
    }
  }

  return join(cachePath, escaped);
}

/* ============== */
/* === String === */
/* ============== */

export async function get(key: string): Promise<string | undefined> {
  try {
    const path = createFilePath(key);
    return await fs.readFile(path, encoding);
  } catch (error) {
    return undefined;
  }
}

export async function put(key: string, data: string): Promise<void> {
  const path = createFilePath(key);
  await fs.writeFile(path, data, encoding);
}

export async function getAllKeys(filter: RegExp): Promise<string[]> {
  const files = await fs.readdir(cachePath);
  return files.filter(filename => filter.test(filename));
}

export async function download(url: string): Promise<string> {
  const cacheKey = url;

  const cached = await get(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await axios.get(url);
  const content = response.data as string;

  await put(cacheKey, content);
  return content;
}

/* ============== */
/* === Binary === */
/* ============== */

/**
 * Get path to cached binary file.
 */
export async function getBinaryPath(key: string): Promise<string | undefined> {
  try {
    const path = createFilePath(key);
    await fs.stat(path); // stat will throw on "ENOENT"
    return path;
  } catch (error) {
    return undefined;
  }
}

/**
 * Add binary data to cache.
 */
export async function putBinary(key: string, data: Stream): Promise<string> {
  const path = createFilePath(key);
  const fileStream = createWriteStream(path);

  data.pipe(fileStream);

  return new Promise((resolve, reject) => {
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  })
    .then(() => path);
}
