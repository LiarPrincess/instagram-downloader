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

export async function downloadMedia(
  mediaEntries: Media[],
  outputDir: string
) {
  for (let index = 0; index < mediaEntries.length; index++) {
    const media = mediaEntries[index];
    console.log(`${index + 1}/${mediaEntries.length} Downloading: ${media.shortCode}`);
    console.log('  Type:', media.type);

    const ownerUsername = media.owner.username;

    switch (media.type) {
      case 'GraphImage':
        await downloadGraphImage(ownerUsername, media, outputDir);
        break;
      case 'GraphSidecar':
        await downloadGraphSidecar(media, outputDir);
        break;
      case 'GraphVideo':
        break;
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
    console.log(`${index + 1}/${mediaEntries.length} Downloading: ${savedMedia.shortCode}`);
    console.log('  Type:', savedMedia.type);

    console.log('  Downloading full media');
    const media = await instagram.getMedia(auth, savedMedia.shortCode, useCache);
    const ownerUsername = media.owner.username;

    switch (media.type) {
      case 'GraphImage':
        await downloadGraphImage(ownerUsername, media, outputDir);
        break;
      case 'GraphSidecar':
        await downloadGraphSidecar(media, outputDir);
        break;
      case 'GraphVideo':
        break;
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
    console.log(`${index + 1}/${mediaEntries.length} Downloading: ${media.shortCode}`);
    console.log('  Type:', media.type);

    switch (media.type) {
      case 'GraphImage':
        await downloadGraphImage(ownerUsername, media, outputDir);
        break;

      case 'GraphSidecar':
        const fullMedia = await instagram.getMedia(auth, media.shortCode, useCache);
        switch (fullMedia.type) {
          case 'GraphSidecar':
            await downloadGraphSidecar(fullMedia, outputDir);
            break;
          default:
            throw new Error(`Inconsistent media type for '${media.shortCode}': ${media.type} vs ${fullMedia.type}`);
        }
        break;

      case 'GraphVideo':
        break;
    }
  }
}
