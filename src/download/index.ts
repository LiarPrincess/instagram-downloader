import * as instagram from '../instagram';
import {
  GuestAuthentication,
  Profile,
  ProfileMedia,
  SavedMedia,
  Media,
  GetMediaError,
  ProfileGraphImage
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
    await downloadSingleMedia(media, outputDir);
  }
}

export async function downloadSavedMedia(
  auth: GuestAuthentication,
  mediaEntries: SavedMedia[],
  outputDir: string,
  useCache: boolean
) {
  for (let index = 0; index < mediaEntries.length; index++) {
    const media = mediaEntries[index];
    console.log(`${index + 1}/${mediaEntries.length} Downloading: ${media.shortCode} (type: ${media.type})`);
    await getAndDownloadSingleMedia(auth, media.shortCode, useCache, outputDir);
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

    switch (media.type) {
      case 'GraphImage':
        await downloadProfileGraphImage(ownerUsername, media, outputDir);
        break;
      case 'GraphSidecar':
      case 'GraphVideo':
        await getAndDownloadSingleMedia(auth, media.shortCode, useCache, outputDir);
        break;
    }
  }
}

/* ==================== */
/* === Single media === */
/* ==================== */

/**
 * Get full media data and download it.
 */
async function getAndDownloadSingleMedia(
  auth: GuestAuthentication,
  shortCode: string,
  useCache: boolean,
  outputDir: string
) {
  let media: Media | undefined;
  while (!media) {
    try {
      media = await instagram.getMedia(auth, shortCode, useCache);
    } catch (error) {
      if (error instanceof GetMediaError && error.allFollowingRequestsWillAlsoFail) {
        // It's not like we can download it, even after 1000 tries...
        return;
      }

      console.log(`${error}`);
      await waitAfterFailedDownload();
    }
  }

  await downloadSingleMedia(media, outputDir);
}

async function downloadSingleMedia(
  media: Media,
  outputDir: string
) {
  let hasDownloadedSuccesfully = false;
  while (!hasDownloadedSuccesfully) {
    try {
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

      hasDownloadedSuccesfully = true;
    } catch (error) {
      console.log(`${error}`);
      await waitAfterFailedDownload();
    }
  }
}

async function downloadProfileGraphImage(
  ownerUsername: string,
  media: ProfileGraphImage,
  outputDir: string
) {
  let hasDownloadedSuccesfully = false;
  while (!hasDownloadedSuccesfully) {
    try {
      await downloadGraphImage(ownerUsername, media, outputDir);
      hasDownloadedSuccesfully = true;
    } catch (error) {
      console.log(`${error}`);
      await waitAfterFailedDownload();
    }
  }
}
