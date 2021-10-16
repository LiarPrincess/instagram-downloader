import { join } from 'path';

import {
  ImageSource,
  toDateString,
  getBiggestImageUrl,
  downloadImageIfNotExists,
  downloadVideoIfNotExists
} from './helpers';

type GraphSidecarChild = GraphSidecarImage | GraphSidecarVideo;

interface GraphSidecarImage {
  readonly type: 'GraphImage';
  readonly displayUrl: string;
  readonly sources: ImageSource[];
}

interface GraphSidecarVideo {
  readonly type: 'GraphVideo';
  readonly videoUrl: string;
}

export async function downloadGraphSidecar(
  ownerUsername: string,
  takenAt: Date,
  children: GraphSidecarChild[],
  downloadVideo: boolean,
  outputDir: string
) {
  const date = toDateString(takenAt);

  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    switch (child.type) {
      case 'GraphImage':
        const imgPath = join(outputDir, `${ownerUsername}-${date}-${index}.jpg`);
        const imgUrl = getBiggestImageUrl(child.displayUrl, child.sources);
        await downloadImageIfNotExists(imgPath, imgUrl);
        break;

      case 'GraphVideo':
        if (downloadVideo) {
          const videoPath = join(outputDir, `${ownerUsername}-${date}-${index}.mp4`);
          await downloadVideoIfNotExists(videoPath, child.videoUrl);
        }
        break;

      default:
        throw new Error(`Unknown sidecar chid media: '${child}'`);
    }
  }
}
