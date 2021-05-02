import { default as axios } from 'axios';
import { promises as fs, createWriteStream } from 'fs';

/* ======================= */
/* === Date formatting === */
/* ======================= */

export function toDateString(date: Date): string {
  const iso = date.toISOString();
  return iso.substring(0, 16).replace('T', ' ').replace(':', '');
}

/* ============ */
/* === Wait === */
/* ============ */

export const seconds = 1000;
export const minutes = 60 * seconds;

export async function waitAfterFailedDownload() {
  const minuteCount = 10;
  console.log(`Waiting ${minuteCount} minutes after failed download`);
  await wait(minuteCount * minutes);
}

function wait(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/* ======================= */
/* === Image selection === */
/* ======================= */

export interface ImageSource {
  readonly url: string;
  readonly width: number;
  readonly height: number;
}

export function getBiggestImageUrl(displayUrl: string, sources?: ImageSource[]): string {
  if (sources && sources.length > 0) {
    let result = sources[0];
    for (const source of sources) {
      if (source.width > result.width) {
        result = source;
      }
    }

    return result.url;
  }

  return displayUrl;
}

/* =================================== */
/* === Download file if not exists === */
/* =================================== */

enum DownloadFileResult {
  downloaded,
  alreadyExists
}

export async function downloadFileIfNotExists(file: string, url: string): Promise<DownloadFileResult> {
  const alreadyExists = await exists(file);
  if (alreadyExists) {
    console.log('  Already exists:', file);
    return DownloadFileResult.alreadyExists;
  }

  console.log('  Creating:', file);
  await downloadBinary(file, url);
  return DownloadFileResult.downloaded;
}

async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
}

async function downloadBinary(file: string, url: string) {
  const response = await axios.request({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  const writer = createWriteStream(file);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
