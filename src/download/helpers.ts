import { default as axios } from 'axios';
import { promises as fs, createWriteStream } from 'fs';
import { exec as exec_ } from 'child_process';
import { promisify } from 'util';

const exec = promisify(exec_);

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

export function getBiggestImageUrl(displayUrl: string, sources: ImageSource[]): string {
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

export async function downloadImageIfNotExists(
  file: string,
  url: string
): Promise<DownloadFileResult> {
  const alreadyExists = await exists(file);
  if (alreadyExists) {
    console.log('  Already exists:', file);
    return DownloadFileResult.alreadyExists;
  }

  console.log('  Creating:', file);

  while (true) {
    try {
      await downloadBinary(file, url);
      return DownloadFileResult.downloaded;
    } catch (error) {
      console.log(`${error}`);
      await waitAfterFailedDownload();
    }
  }
}

export async function downloadVideoIfNotExists(
  file: string,
  url: string
): Promise<DownloadFileResult> {
  const alreadyExists = await exists(file);
  if (alreadyExists) {
    console.log('  Already exists:', file);
    return DownloadFileResult.alreadyExists;
  }

  console.log('  Creating:', file);

  // We are going to use 'ffmpeg' because sometimes normal download does not work.
  const command = `ffmpeg -i "${url}" -c copy "${file}"`;
  const { stdout, stderr } = await exec(command);
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);

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
