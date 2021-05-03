import * as instagram from '../instagram';
import {
  GuestAuthentication,
  Profile,
  ProfileMedia,
  SavedMedia,
  Media
} from '../instagram';

import { downloadGraphImage } from './graph-image';
import { downloadGraphSidecar } from './graph-sidecar';
import { downloadGraphVideo } from './graph-video';
import { waitAfterFailedDownload } from './helpers';

export async function downloadMedia(
  mediaEntries: Media[],
  outputDir: string
) {
  for (let index = 0; index < mediaEntries.length; index++) {
    const media = mediaEntries[index];
    console.log(`${index + 1}/${mediaEntries.length} Downloading: ${media.shortCode} (type: ${media.type})`);

    let hasDownloadedSuccesfully = false;
    while (!hasDownloadedSuccesfully) {
      try {
        await tryDownloadSingleMedia(media, outputDir);
        hasDownloadedSuccesfully = true;
      } catch (error) {
        console.log(`${error}`);
        await waitAfterFailedDownload();
      }
    }
  }
}

export async function downloadSavedMedia(
  auth: GuestAuthentication,
  mediaEntries: SavedMedia[],
  outputDir: string,
  useCache: boolean
) {
  for (let index = 0; index < mediaEntries.length; index++) {
    const savedMedia = mediaEntries[index];
    console.log(`${index + 1}/${mediaEntries.length} Downloading: ${savedMedia.shortCode} (type: ${savedMedia.type})`);

    let hasDownloadedSuccesfully = false;
    while (!hasDownloadedSuccesfully) {
      try {
        const mediaResponse = await getMedia(auth, savedMedia.shortCode, useCache);
        switch (mediaResponse.type) {
          case 'Media':
            await tryDownloadSingleMedia(mediaResponse.media, outputDir);
            break;
          case 'PrivateProfile':
            // We can't download it, so we will just skip
            break;
        }
        hasDownloadedSuccesfully = true;
      } catch (error) {
        console.log(`${error}`);
        await waitAfterFailedDownload();
      }
    }
  }
}

export async function downloadProfileMedia(
  auth: GuestAuthentication,
  profile: Profile,
  mediaEntries: ProfileMedia[],
  outputDir: string,
  useCache: boolean
) {
  const ownerUsername = profile.username;

  for (let index = 0; index < mediaEntries.length; index++) {
    const media = mediaEntries[index];
    console.log(`${index + 1}/${mediaEntries.length} Downloading: ${media.shortCode} (type: ${media.type})`);

    let hasDownloadedSuccesfully = false;
    while (!hasDownloadedSuccesfully) {
      try {
        switch (media.type) {
          case 'GraphImage':
            await downloadGraphImage(ownerUsername, media, outputDir);
            break;
          case 'GraphSidecar':
          case 'GraphVideo':
            const mediaResponse = await getMedia(auth, media.shortCode, useCache);
            switch (mediaResponse.type) {
              case 'Media':
                await tryDownloadSingleMedia(mediaResponse.media, outputDir);
                break;
              case 'PrivateProfile':
                // We can't download it, so we will just skip
                break;
            }

            hasDownloadedSuccesfully = true;
            break;
        }
      } catch (error) {
        console.log(`${error}`);
        await waitAfterFailedDownload();
      }
    }
  }
}

interface MediaResponse {
  readonly type: 'Media';
  readonly media: instagram.Media;
}

interface ProfileIsPrivate {
  readonly type: 'PrivateProfile';
}

async function getMedia(
  auth: GuestAuthentication,
  shortCode: string,
  useCache: boolean
): Promise<MediaResponse | ProfileIsPrivate> {
  try {
    const media = await instagram.getMedia(auth, shortCode, useCache);
    return { type: 'Media', media };
  } catch (error) {
    const message: string | undefined = error.message;
    if (message) {
      // All possible methods to get media failed:
      // - GET request: Error: Invalid response content type: 'text/html; charset=utf-8' (expected json).
      // - browser __initialData: Error: Profile 'Quil' is private
      // - browser _sharedData: Error: Profile 'Quil' is private

      const isPrivate = message.search(/Error: Profile '.*' is private/);
      if (isPrivate) {
        return { type: 'PrivateProfile' };
      }
    }

    throw error;
  }
}

async function tryDownloadSingleMedia(media: instagram.Media, outputDir: string) {
  switch (media.type) {
    case 'GraphImage':
      const ownerUsername = media.owner.username;
      await downloadGraphImage(ownerUsername, media, outputDir);
      break;
    case 'GraphSidecar':
      await downloadGraphSidecar(media, outputDir);
      break;
    case 'GraphVideo':
      await downloadGraphVideo('TYPECHECK_TOKEN');
      break;
  }
}
