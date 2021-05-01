import { join } from 'path';

import {
  ImageSource,
  toDateString,
  getBiggestImageUrl,
  downloadFileIfNotExists
} from './helpers';

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
  media: {
    owner: {
      username: string
    },
    takenAt: Date,
    children: GraphSidecarChild[]
  },
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
        console.log('  Path:', imgPath);
        console.log('  Url:', imgUrl);
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
