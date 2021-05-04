import {
  Media, Owner, Common, GraphSidecarChild, ImageSource,
  ApiResponse
} from './types';
import { parseTimestamp } from '../common';

export function parseApiResponse(response: ApiResponse.Root): Media {
  const media = response.graphql.shortcode_media;

  const owner: Owner = {
    id: media.owner.id,
    username: media.owner.username,
    full_name: media.owner.full_name,
    profilePicUrl: media.owner.profile_pic_url
  };

  const common: Common = {
    id: media.id,
    shortCode: media.shortcode,
    owner,
    takenAt: parseTimestamp(media.taken_at_timestamp),
    likeCount: media.edge_media_preview_like.count,
    commentCount: media.edge_media_preview_comment.count,
  };

  switch (media.__typename) {
    case 'GraphImage':
      const displayUrl = media.display_url;
      const sources = toImageSources(media.display_resources);
      return { type: 'GraphImage', displayUrl, sources, ...common };

    case 'GraphSidecar':
      const children: GraphSidecarChild[] = [];
      for (const edge of media.edge_sidecar_to_children.edges) {
        const child = edge.node;
        const id = child.id;
        const shortCode = child.shortcode;

        switch (child.__typename) {
          case 'GraphImage':
            const displayUrl = child.display_url;
            const sources = toImageSources(child.display_resources);
            children.push({ type: 'GraphImage', id, shortCode, displayUrl, sources });
            break;

          case 'GraphVideo':
            const videoUrl = child.video_url;
            children.push({ type: 'GraphVideo', id, shortCode, videoUrl });
            break;

          default:
            throw new Error(`Unknown sidecar children media type '${child.__typename}'.`);
        }
      }

      return { type: 'GraphSidecar', children, ...common };

    case 'GraphVideo':
      const videoUrl = media.video_url;
      return { type: 'GraphVideo', videoUrl, ...common };

    default:
      throw new Error(`Unknown media type '${media.__typename}'.`);
  }
}

function toImageSources(resources: ApiResponse.DisplayResource[]): ImageSource[] {
  return resources.map(r => ({
    url: r.src,
    width: r.config_width,
    height: r.config_height
  }));
}
