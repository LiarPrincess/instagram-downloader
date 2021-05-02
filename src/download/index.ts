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
        const media = await instagram.getMedia(auth, savedMedia.shortCode, useCache);
        await tryDownloadSingleMedia(media, outputDir);
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
            const fullMedia = await instagram.getMedia(auth, media.shortCode, useCache);
            await tryDownloadSingleMedia(fullMedia, outputDir);
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
