import { ProfileMedia, ProfileMediaData, ApiResponse } from './types';
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

    let data: ProfileMediaData;
    switch (media.__typename) {
      case 'GraphImage':
        const displayUrl = media.display_url;
        data = { 'type': 'GraphImage', displayUrl };
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

    const profileMedia = new ProfileMedia(
      media.id,
      media.shortcode,
      parseTimestamp(media.taken_at_timestamp),
      data,
      media.edge_media_preview_like.count,
      media.edge_media_to_comment.count
    );

    result.push(profileMedia);
  }

  return result;
}

function parseEndCursor(response: ApiResponse.Root): string | undefined {
  const mediaPage = response.data.user.edge_owner_to_timeline_media;
  const page = mediaPage.page_info;
  return page.has_next_page ? page.end_cursor : undefined;
}
