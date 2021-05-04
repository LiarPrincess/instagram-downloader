import { SavedMedia, Common, ApiResponse } from './types';
import { parseTimestamp } from '../common';

interface ParsedApiResponse {
  readonly media: SavedMedia[];
  readonly endCursor: string | undefined;
}

export function parseApiResponse(response: ApiResponse.Root): ParsedApiResponse {
  const media = parseMedia(response);
  const endCursor = parseEndCursor(response);
  return { media, endCursor };
}

function parseMedia(response: ApiResponse.Root): SavedMedia[] {
  const result: SavedMedia[] = [];
  const mediaPage = response.data.user.edge_saved_media;

  for (const edge of mediaPage.edges) {
    const media = edge.node;

    const common: Common = {
      id: media.id,
      shortCode: media.shortcode,
      takenAt: parseTimestamp(media.taken_at_timestamp),
      ownerId: media.owner.id,
      likeCount: media.edge_liked_by.count
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
  const mediaPage = response.data.user.edge_saved_media;
  const page = mediaPage.page_info;
  return page.has_next_page ? page.end_cursor : undefined;
}
