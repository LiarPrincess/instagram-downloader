import * as instagram from '../instagram';
import {
  GuestAuthentication,
  Profile,
  ProfileMedia,
  SavedMedia,
  Media,
  GetMediaError
} from '../instagram';

import { downloadGraphImage } from './graph-image';
import { downloadGraphSidecar } from './graph-sidecar';
import { downloadGraphVideo } from './graph-video';
import { ImageSource, waitAfterFailedDownload } from './helpers';
import { isKnownUnavailableMedia, markMediaAsUnavailable } from './known-unavailable-media';

const downloadVideo = false;

export async function downloadMedia(
  mediaEntries: Media[],
  outputDir: string
) {
  const mediaLength = mediaEntries.length;

  for (let index = 0; index < mediaLength; index++) {
    const media = mediaEntries[index];
    const shortCode = media.shortCode;
    const type = media.data.type;
    const progress = `${index + 1}/${mediaLength}`;

    const isUnavailable = await isKnownUnavailableMedia(shortCode);
    if (isUnavailable) {
      console.log(`${progress} '${shortCode}' is known to be unavailable (type: ${type}).`);
      continue;
    }

    console.log(`${progress} Downloading: ${shortCode} (type: ${type})`);
    await downloadSingleMedia(media, outputDir);
  }
}

export async function downloadSavedMedia(
  auth: GuestAuthentication,
  mediaEntries: SavedMedia[],
  outputDir: string,
  useCache: boolean
) {
  const mediaLength = mediaEntries.length;

  for (let index = 0; index < mediaLength; index++) {
    const media = mediaEntries[index];
    const shortCode = media.shortCode;
    const type = media.data.type;
    const progress = `${index + 1}/${mediaLength}`;

    const isUnavailable = await isKnownUnavailableMedia(shortCode);
    if (isUnavailable) {
      console.log(`${progress} '${shortCode}' is known to be unavailable (type: ${type}).`);
      continue;
    }

    // We do not have the 'ownerUsername', so we have to download full media.
    console.log(`${progress} Downloading: ${shortCode} (type: ${type})`);
    await getAndDownloadSingleMedia(auth, shortCode, useCache, outputDir);
  }
}

export async function downloadProfileMedia(
  auth: GuestAuthentication,
  profile: Profile,
  mediaEntries: ProfileMedia[],
  outputDir: string,
  useCache: boolean
) {
  const mediaLength = mediaEntries.length;

  for (let index = 0; index < mediaLength; index++) {
    const media = mediaEntries[index];
    const shortCode = media.shortCode;
    const type = media.data.type;
    const progress = `${index + 1}/${mediaLength}`;

    const isUnavailable = await isKnownUnavailableMedia(shortCode);
    if (isUnavailable) {
      console.log(`${progress} '${shortCode}' is known to be unavailable (type: ${type}).`);
      continue;
    }

    console.log(`${progress} Downloading: '${shortCode}' (type: ${type})`);

    switch (media.data.type) {
      case 'GraphImage':
        const ownerUsername = profile.username;
        const takenAt = media.takenAt;
        const displayUrl = media.data.displayUrl;
        const sources: ImageSource[] = [];
        await downloadGraphImage(ownerUsername, takenAt, displayUrl, sources, outputDir);
        break;
      case 'GraphSidecar':
      case 'GraphVideo':
        await getAndDownloadSingleMedia(auth, shortCode, useCache, outputDir);
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
        console.log(`Marking media as unavailable.`);
        await markMediaAsUnavailable(shortCode);
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
  const ownerUsername = media.owner.username;
  const takenAt = media.takenAt;

  switch (media.data.type) {
    case 'GraphImage':
      const displayUrl = media.data.displayUrl;
      const sources = media.data.sources;
      await downloadGraphImage(ownerUsername, takenAt, displayUrl, sources, outputDir);
      break;
    case 'GraphSidecar':
      const children = media.data.children;
      await downloadGraphSidecar(ownerUsername, takenAt, children, downloadVideo, outputDir);
      break;
    case 'GraphVideo':
      if (downloadVideo) {
        const videoUrl = media.data.videoUrl;
        await downloadGraphVideo(ownerUsername, takenAt, videoUrl, outputDir);
      }
      break;
  }
}
