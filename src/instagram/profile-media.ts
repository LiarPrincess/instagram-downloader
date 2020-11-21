import { get } from './common/request';
import { GuestAuthentication } from './authenticate';
import { ProfileMediaResponse } from './response-types/profile-media-response';

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

export async function getProfileMedia(auth: GuestAuthentication, profileId: string): Promise<ProfileMedia[]> {
  const result: ProfileMedia[] = [];

  let endCursor: string | undefined = undefined;
  do {
    const query = createQuery(profileId, endCursor);
    const response = await get(auth, query.url, query.gisData) as ProfileMediaResponse;
    const media = response.data.user.edge_owner_to_timeline_media;

    for (const edge of media.edges) {
      const node = edge.node;
      const type = parseType(node.__typename);
      const takenAt = parseDate(node.taken_at_timestamp);

      result.push({
        type,
        id: node.id,
        shortCode: node.shortcode,
        takenAt,
        likeCount: node.edge_media_preview_like.count,
        commentCount: node.edge_media_to_comment.count
      });
    }

    const page = media.page_info;
    endCursor = page.has_next_page ? page.end_cursor : undefined;
  } while (endCursor != undefined);

  return result;
}

interface Query {
  readonly url: string;
  readonly gisData: string;
}

function createQuery(profileId: string, endCursor: string | undefined): Query {
  const after = endCursor == undefined ? 'null' : `"${endCursor}"`;
  const params = `{"id":"${profileId}","first":50,"after":${after}}`;
  const url = `https://www.instagram.com/graphql/query/?query_hash=42323d64886122307be10013ad2dcc44&variables=${params}`;
  return { url, gisData: params };
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

function parseDate(timestamp: number): Date {
  const milliseconds = timestamp * 1000;
  return new Date(milliseconds);
}
