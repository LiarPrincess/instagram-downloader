import { join } from 'path';

import {
  ImageSource,
  toDateString,
  getBiggestImageUrl,
  downloadImageIfNotExists
} from './helpers';

export async function downloadGraphImage(
  ownerUsername: string,
  takenAt: Date,
  displayUrl: string,
  sources: ImageSource[],
  outputDir: string
) {
  const date = toDateString(takenAt);
  const path = join(outputDir, `${ownerUsername}-${date}.jpg`);
  const url = getBiggestImageUrl(displayUrl, sources);
  await downloadImageIfNotExists(path, url);
}
