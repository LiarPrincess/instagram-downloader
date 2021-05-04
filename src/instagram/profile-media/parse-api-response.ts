import { ProfileMedia, Common, ApiResponse } from './types';
import { parseTimestamp } from '../common';

interface ParsedApiResponse {
  readonly media: ProfileMedia[];
  readonly endCursor: string | undefined;
}

export function parseApiResponse(response: ApiResponse.Root): ParsedApiResponse {
  const media = parseMedia(response);
  const endCursor = parseEndCursor(response);
  return { media, endCursor };
}

function parseMedia(response: ApiResponse.Root): ProfileMedia[] {
  const result: ProfileMedia[] = [];
  const mediaPage = response.data.user.edge_owner_to_timeline_media;

  for (const edge of mediaPage.edges) {
    const media = edge.node;

    const common: Common = {
      id: media.id,
      shortCode: media.shortcode,
      takenAt: parseTimestamp(media.taken_at_timestamp),
      likeCount: media.edge_media_preview_like.count,
      commentCount: media.edge_media_to_comment.count
    };

    switch (media.__typename) {
      case 'GraphImage':
        const displayUrl = media.display_url;
        result.push({ type: 'GraphImage', displayUrl, ...common });
        break;

      case 'GraphSidecar':
        result.push({ type: 'GraphSidecar', ...common });
        break;

      case 'GraphVideo':
        result.push({ type: 'GraphVideo', ...common });
        break;

      default:
        throw new Error(`Unknown media type '${media.__typename}'.`);
    }
  }

  return result;
}

function parseEndCursor(response: ApiResponse.Root): string | undefined {
  const mediaPage = response.data.user.edge_owner_to_timeline_media;
  const page = mediaPage.page_info;
  return page.has_next_page ? page.end_cursor : undefined;
}
