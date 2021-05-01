import { join } from 'path';

import {
  ImageSource,
  toDateString,
  getBiggestImageUrl,
  downloadFileIfNotExists,
  waitAfterFailedDownload
} from './helpers';

interface GraphSidecar {
  readonly owner: {
    readonly username: string
  };
  readonly takenAt: Date;
  readonly children: GraphSidecarChild[];
}

type GraphSidecarChild = GraphSidecarImage | GraphSidecarVideo;

interface GraphSidecarImage {
  readonly type: 'GraphImage';
  readonly displayUrl: string;
  readonly sources: ImageSource[];
}

interface GraphSidecarVideo {
  readonly type: 'GraphVideo';
}

export async function downloadGraphSidecar(
  media: GraphSidecar,
  outputDir: string
) {
  while (true) {
    try {
      await tryDownload(media, outputDir);
      return;
    } catch (error) {
      console.log(`${error}`);
      await waitAfterFailedDownload();
    }
  }
}

async function tryDownload(
  media: GraphSidecar,
  outputDir: string
) {
  const ownerUsername = media.owner.username;
  const date = toDateString(media.takenAt);

  for (let index = 0; index < media.children.length; index++) {
    const child = media.children[index];
    switch (child.type) {
      case 'GraphImage':
        const imgPath = join(outputDir, `${ownerUsername}-${date}-${index}.jpg`);
        const imgUrl = getBiggestImageUrl(child.displayUrl, child.sources);
        await downloadFileIfNotExists(imgPath, imgUrl);
        break;

      case 'GraphVideo':
        const videoPath = join(outputDir, `${ownerUsername}-${date}-${index}.mp4`);
        // await downloadIfNotExists(videoPath, child.videoUrl);
        break;

      default:
        throw new Error(`Unknown sidecar chid media: '${child}'`);
    }
  }
}
