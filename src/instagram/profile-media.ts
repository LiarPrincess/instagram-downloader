import { Profile } from './profile';
import { getJSON } from './common/request';
import { parseTimestamp } from './common/timestamp';
import { GuestAuthentication } from './authenticate';
import { ProfileMediaResponse } from './response-types/profile-media-response';
import { Cache } from '../cache';

const cache = new Cache('profile-media');

export enum ProfileMediaType {
  GraphImage,
  GraphSidecar,
  GraphVideo
}

export type ProfileMedia = {
  readonly type: ProfileMediaType;

  readonly id: string;
  readonly shortCode: string;
  readonly takenAt: Date;

  readonly likeCount: number;
  readonly commentCount: number;
};

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
      const node = edge.node;
      const type = parseType(node.__typename);
      const takenAt = parseTimestamp(node.taken_at_timestamp);

      result.push({
        type,
        id: node.id,
        shortCode: node.shortcode,
        takenAt,
        likeCount: node.edge_media_preview_like.count,
        commentCount: node.edge_media_to_comment.count
      });
    }

    const page = mediaPage.page_info;
    endCursor = page.has_next_page ? page.end_cursor : undefined;
  } while (endCursor != undefined);

  return result;
}

export async function get(
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

  return response;
}

function parseType(nodeType: string): ProfileMediaType {
  const allCases = Object.keys(ProfileMediaType);

  for (const string of allCases) {
    if (string == nodeType) {
      return ProfileMediaType[string as keyof typeof ProfileMediaType];
    }
  }

  throw new Error(`Unknown media type '${nodeType}'.`);
}
