import { join } from 'path';

import { toDateString, downloadVideoIfNotExists } from './helpers';

const extension = 'mp4';

export async function downloadGraphVideo(
  ownerUsername: string,
  takenAt: Date,
  videoUrl: string,
  outputDir: string
) {
  const date = toDateString(takenAt);
  const path = join(outputDir, `${ownerUsername}-${date}.${extension}`);

  if (!videoUrl.includes(extension)) {
    throw new Error(`Video is not '${extension}'!`);
  }

  await downloadVideoIfNotExists(path, videoUrl);
}
