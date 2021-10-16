import { SavedMedia, SavedMediaData, ApiResponse } from './types';
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

    let data: SavedMediaData;
    switch (media.__typename) {
      case 'GraphImage':
        const displayUrl = media.display_url;
        data = { type: 'GraphImage', displayUrl };
        break;
      case 'GraphSidecar':
        data = { type: 'GraphSidecar' };
        break;
      case 'GraphVideo':
        data = { type: 'GraphVideo' };
        break;
      default:
        throw new Error(`Unknown media type '${media.__typename}'.`);
    }

    const savedMedia = new SavedMedia(
      media.id,
      media.shortcode,
      parseTimestamp(media.taken_at_timestamp),
      media.owner.id,
      data,
      media.edge_liked_by.count
    );

    result.push(savedMedia);
  }

  return result;
}

function parseEndCursor(response: ApiResponse.Root): string | undefined {
  const mediaPage = response.data.user.edge_saved_media;
  const page = mediaPage.page_info;
  return page.has_next_page ? page.end_cursor : undefined;
}
