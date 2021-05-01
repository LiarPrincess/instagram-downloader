import { default as axios } from 'axios';

import { Profile } from './profile';
import { BrowserAuthentication } from './authenticate';
import { UserSavedResponse } from './response-types/user-saved';
import { parseTimestamp, waitAfterRequestToPreventBan, seconds } from './common';
import { Cache } from '../cache';

const cache = new Cache('user-saved');

export type SavedMedia = SavedGraphImage | SavedGraphSidecar | SavedGraphVideo;

interface Common {
  readonly id: string;
  readonly shortCode: string;
  readonly takenAt: Date;
  readonly ownerId: string;
  readonly likeCount: number;
}

interface SavedGraphImage extends Common {
  readonly type: 'GraphImage';
  readonly displayUrl: string;
}

interface SavedGraphSidecar extends Common {
  readonly type: 'GraphSidecar';
}

interface SavedGraphVideo extends Common {
  readonly type: 'GraphVideo';
}

export async function getSavedMedia(
  auth: BrowserAuthentication,
  profile: Profile,
  useCache: boolean
): Promise<SavedMedia[]> {
  console.log('Getting saved media for:', profile.username);
  const result: SavedMedia[] = [];

  let endCursor: string | undefined = undefined;
  do {
    console.log('  Page:', endCursor || 'first');
    const response = await get(auth, profile, endCursor, useCache) as UserSavedResponse;
    const mediaPage = response.data.user.edge_saved_media;

    console.log('    Parsing response');
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

    const page = mediaPage.page_info;
    endCursor = page.has_next_page ? page.end_cursor : undefined;
  } while (endCursor != undefined);

  return result;
}

async function get(
  auth: BrowserAuthentication,
  profile: Profile,
  endCursor: string | undefined,
  useCache: boolean
): Promise<UserSavedResponse> {
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

  // There is also 'https://www.instagram.com/USERNAME/saved/?__a=1' if this fails.
  const after = endCursor == undefined ? 'null' : `"${endCursor}"`;
  const params = `{"id":"${profile.id}","first":50,"after":${after}}`;
  const url = `https://www.instagram.com/graphql/query/?query_hash=2ce1d673055b99250e93b6f88f878fde&variables=${params}`;

  const cookies = [
    `csrftoken=${auth.csrfToken}`,
    // `ds_user_id=${profile.id}`, // not needed
    `sessionid=${auth.sessionId}`
  ];

  console.log('    Requesting page');
  const response = await axios.get(url, {
    headers: {
      'Referer': `https://www.instagram.com/${profile.username}/saved/`,
      'Cookie': cookies.join('; '),
      'X-IG-App-ID': '936619743392459',
      'X-CSRFToken': auth.csrfToken
    }
  });

  const data = response.data;
  await cache.put(cacheKey, JSON.stringify(data));
  await waitAfterRequestToPreventBan(2 * seconds);

  return data;
}
