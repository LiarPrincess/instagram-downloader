import { join } from 'path';

import {
  ImageSource,
  toDateString,
  getBiggestImageUrl,
  downloadFileIfNotExists
} from './helpers';

interface GraphImage {
  readonly takenAt: Date;
  readonly displayUrl: string;
  readonly sources?: ImageSource[];
}

export async function downloadGraphImage(
  ownerUsername: string,
  media: GraphImage,
  outputDir: string
) {
  const date = toDateString(media.takenAt);
  const path = join(outputDir, `${ownerUsername}-${date}.jpg`);
  const url = getBiggestImageUrl(media.displayUrl, media.sources);
  await downloadFileIfNotExists(path, url);
}
