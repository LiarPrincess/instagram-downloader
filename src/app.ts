import { join } from 'path';
import { promises as fs } from 'fs';

import * as download from './download';
import * as instagram from './instagram';
import { BrowserAuthentication, GuestAuthentication } from './instagram';

const useCache = true;
const outputDir = './output';

(async () => {
  try {
    const guestAuth = await instagram.authenticateAsGuest();

    // You can get them from cookies in the browser
    const browserAuth = {
      sessionId: '6126805921%3Aq3zdVl2QGY5v2D%3A12',
      csrfToken: '7k7yO1a5kKcs7gjZHWp0Oiy8sFf1dqPj'
    };

    // === Profile ===
    // const username = 'best.dressed';
    // const username = 'dd_toys._';
    // const username = 'kawaiibettyjiang';
    // await downloadAllProfileMedia(guestAuth, username);

    // === Saved ===
    const myUsername = 'liarprincesss';
    await downloadAllSaved(guestAuth, browserAuth, myUsername);

    console.log('Finished');
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
})();

async function downloadAllProfileMedia(
  guestAuth: GuestAuthentication,
  username: string
) {
  const profile = await instagram.getProfile(guestAuth, username, useCache);
  const media = await instagram.getProfileMedia(guestAuth, profile, useCache);

  const profileOutputDir = join(outputDir, username);
  await fs.mkdir(profileOutputDir, { recursive: true });
  await download.downloadProfileMedia(guestAuth, profile, media, profileOutputDir, useCache);
}

async function downloadAllSaved(
  guestAuth: GuestAuthentication,
  browserAuth: BrowserAuthentication,
  myUsername: string
) {
  const profile = await instagram.getProfile(guestAuth, myUsername, useCache);
  let media = await instagram.getSavedMedia(browserAuth, profile, useCache);
  media = await removeKnownNotAvailableMedia(media);
  await download.downloadSavedMedia(guestAuth, media, outputDir, useCache);
}

interface HasShortCode {
  readonly shortCode: string;
}

async function removeKnownNotAvailableMedia(medias: HasShortCode[]): Promise<any[]> {
  const knownContent = await fs.readFile('./known-not-available-media.txt', 'utf-8');
  const knownLines = knownContent.split('\n');

  const knownNotAvailableShortCodes = new Set<string>();
  for (const l of knownLines) {
    const line = l.trim();
    const isValidLine = line && !line.startsWith('#');
    if (isValidLine) {
      knownNotAvailableShortCodes.add(line);
    }
  }

  const result: HasShortCode[] = [];

  for (const media of medias) {
    const isNotAvailable = knownNotAvailableShortCodes.has(media.shortCode);
    const isAvailable = !isNotAvailable;
    if (isAvailable) {
      result.push(media);
    }
  }

  return result;
}
