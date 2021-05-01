import { join } from 'path';

import {
  ImageSource,
  toDateString,
  getBiggestImageUrl,
  downloadFileIfNotExists
} from './helpers';

export async function downloadGraphImage(
  ownerUsername: string,
  media: {
    takenAt: Date,
    displayUrl: string,
    sources?: ImageSource[]
  },
  outputDir: string
) {
  const date = toDateString(media.takenAt);
  const path = join(outputDir, `${ownerUsername}-${date}.jpg`);
  console.log('  Path:', path);

  const url = getBiggestImageUrl(media.displayUrl, media.sources);
  console.log('  Url:', url);

  await downloadFileIfNotExists(path, url);
}
