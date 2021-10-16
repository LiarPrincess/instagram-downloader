import {
  Media, MediaOwner, MediaData, MediaSidecarChild, MediaSidecarImage, MediaSidecarVideo, ImageSource,
  ApiResponse
} from './types';
import { parseTimestamp } from '../common';

export function parseApiResponse(response: ApiResponse.Root): Media {
  const media = response.graphql.shortcode_media;

  let data: MediaData;
  switch (media.__typename) {
    case 'GraphImage':
      const displayUrl = media.display_url;
      const sources = toImageSources(media.display_resources);
      data = { type: 'GraphImage', displayUrl, sources };
      break;

    case 'GraphSidecar':
      const children: MediaSidecarChild[] = [];
      for (const edge of media.edge_sidecar_to_children.edges) {
        const child = edge.node;
        const id = child.id;
        const shortCode = child.shortcode;

        switch (child.__typename) {
          case 'GraphImage':
            const displayUrl = child.display_url;
            const sources = toImageSources(child.display_resources);
            const image = new MediaSidecarImage(id, shortCode, displayUrl, sources);
            children.push(image);
            break;

          case 'GraphVideo':
            const videoUrl = child.video_url;
            const video = new MediaSidecarVideo(id, shortCode, videoUrl);
            children.push(video);
            break;

          default:
            throw new Error(`Unknown sidecar children media type '${child.__typename}'.`);
        }
      }

      data = { type: 'GraphSidecar', children };
      break;

    case 'GraphVideo':
      const videoUrl = media.video_url;
      data = { type: 'GraphVideo', videoUrl };
      break;

    default:
      throw new Error(`Unknown media type '${media.__typename}'.`);
  }

  const owner = new MediaOwner(
    media.owner.id,
    media.owner.username,
    media.owner.full_name,
    media.owner.profile_pic_url
  );

  return new Media(
    media.id,
    media.shortcode,
    owner,
    parseTimestamp(media.taken_at_timestamp),
    data,
    media.edge_media_preview_like.count,
    media.edge_media_preview_comment.count,
  );
}

function toImageSources(resources: ApiResponse.DisplayResource[]): ImageSource[] {
  return resources.map(r => ({
    url: r.src,
    width: r.config_width,
    height: r.config_height
  }));
}
