import { GuestAuthentication } from './authenticate';
import { MediaBrowserPage } from './media-by-browser';
import { Media as MediaResponse, DisplayResource } from './response-types/media';
import { getJSON, parseTimestamp, waitAfterMediaRequestToPreventBan } from './common';
import { Cache } from '../cache';

const cache = new Cache('media');

export type Media = GraphImage | GraphSidecar | GraphVideo;

interface Common {
  readonly id: string;
  readonly shortCode: string;
  readonly owner: Owner;
  readonly takenAt: Date;

  readonly likeCount: number;
  readonly commentCount: number;
}

interface Owner {
  readonly id: string;
  readonly username: string;
  readonly full_name: string;
  readonly profilePicUrl: string;
}

interface GraphImage extends Common {
  readonly type: 'GraphImage';
  readonly displayUrl: string;
  readonly sources: ImageSource[];
}

interface GraphSidecar extends Common {
  readonly type: 'GraphSidecar';
  readonly children: GraphSidecarChild[];
}

type GraphSidecarChild = GraphSidecarImage | GraphSidecarVideo;

interface GraphSidecarImage {
  readonly type: 'GraphImage';
  readonly id: string;
  readonly shortCode: string;
  readonly displayUrl: string;
  readonly sources: ImageSource[];
}

interface GraphSidecarVideo {
  readonly type: 'GraphVideo';
  readonly id: string;
  readonly shortCode: string;
  readonly videoUrl: string;
}

interface GraphVideo extends Common {
  readonly type: 'GraphVideo';
  readonly videoUrl: string;
}

interface ImageSource {
  readonly url: string;
  readonly width: number;
  readonly height: number;
}

export async function getMedia(
  auth: GuestAuthentication,
  shortCode: string,
  useCache: boolean
): Promise<Media> {
  console.log('Getting media:', shortCode);
  const response = await get(auth, shortCode, useCache);
  const media = response.graphql.shortcode_media;

  console.log('  Parsing response');
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

async function get(
  auth: GuestAuthentication,
  shortCode: string,
  useCache: boolean
): Promise<MediaResponse> {
  const cacheKey = shortCode + '.json';

  if (useCache) {
    const string = await cache.get(cacheKey);
    if (string) {
      console.log('  Found cached response');
      const result = JSON.parse(string);
      return result;
    }
  }

  const url = `https://www.instagram.com/p/${shortCode}/?__a=1`;
  console.log('  Requesting:', url);

  let requestError: Error;
  try {
    const response = await getJSON(auth, url) as MediaResponse;
    await cache.put(cacheKey, JSON.stringify(response));
    await waitAfterMediaRequestToPreventBan();
    return response;
  } catch (error) {
    console.log(`    ${error}`);
    requestError = error;
  }

  const page = new MediaBrowserPage(shortCode, useCache);
  console.log('  Opening media in browser:', page.url);

  let __initialDataError: Error;
  try {
    const response = await page.getMediaFrom__initialData();
    await cache.put(cacheKey, JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(`    ${error}`);
    __initialDataError = error;
  }

  let _sharedDataError: Error;
  try {
    const response = await page.getMediaFrom_sharedData();
    await cache.put(cacheKey, JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(`    ${error}`);
    _sharedDataError = error;
  }

  const msg = `\
All possible methods to get media failed:
- GET request: ${requestError}
- browser __initialData: ${__initialDataError}
- browser _sharedData: ${_sharedDataError}
`;

  throw new Error(msg);
}

function toImageSources(resources: DisplayResource[]): ImageSource[] {
  return resources.map(r => ({
    url: r.src,
    width: r.config_width,
    height: r.config_height
  }));
}
