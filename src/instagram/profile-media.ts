import { Profile } from './profile';
import { GuestAuthentication } from './authenticate';
import { ProfileMediaResponse } from './response-types/profile-media';
import { getJSON, parseTimestamp, waitAfterRequestToPreventBan, seconds } from './common';
import { Cache } from '../cache';

const cache = new Cache('profile-media');

export type ProfileMedia = ProfileGraphImage | ProfileGraphSidecar | ProfileGraphVideo;

interface Common {
  readonly id: string;
  readonly shortCode: string;
  readonly takenAt: Date;

  readonly likeCount: number;
  readonly commentCount: number;
}

interface ProfileGraphImage extends Common {
  readonly type: 'GraphImage';
  readonly displayUrl: string;
}

interface ProfileGraphSidecar extends Common {
  readonly type: 'GraphSidecar';
}

interface ProfileGraphVideo extends Common {
  readonly type: 'GraphVideo';
}

export async function getProfileMedia(
  auth: GuestAuthentication,
  profile: Profile,
  useCache: boolean
): Promise<ProfileMedia[]> {
  console.log('Getting media for:', profile.username);
  const result: ProfileMedia[] = [];

  let endCursor: string | undefined = undefined;
  do {
    console.log('  Page:', endCursor || 'first');
    const response = await get(auth, profile, endCursor, useCache) as ProfileMediaResponse;
    const mediaPage = response.data.user.edge_owner_to_timeline_media;

    console.log('    Parsing response');
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

    const page = mediaPage.page_info;
    endCursor = page.has_next_page ? page.end_cursor : undefined;
  } while (endCursor != undefined);

  return result;
}

async function get(
  auth: GuestAuthentication,
  profile: Profile,
  endCursor: string | undefined,
  useCache: boolean
): Promise<ProfileMediaResponse> {
  const cacheKeyCursor = endCursor == undefined ? '' : '_' + endCursor;
  const cacheKey = `${profile.username}${cacheKeyCursor}.json`;

  if (useCache) {
    const string = await cache.get(cacheKey);
    if (string) {
      console.log('    Found cached response');
      const result = JSON.parse(string);
      return result;
    }
  }

  const after = endCursor == undefined ? 'null' : `"${endCursor}"`;
  const params = `{"id":"${profile.id}","first":50,"after":${after}}`;
  const url = `https://www.instagram.com/graphql/query/?query_hash=42323d64886122307be10013ad2dcc44&variables=${params}`;
  const gisData = params;

  console.log('    Requesting page');
  const response = await getJSON(auth, url, gisData);
  await cache.put(cacheKey, JSON.stringify(response));
  await waitAfterRequestToPreventBan(2 * seconds);

  return response;
}
