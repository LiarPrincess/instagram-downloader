import * as download from '../download';
import * as instagram from '../instagram';
import { BrowserAuthentication, GuestAuthentication } from '../instagram';

export async function downloadSavedMedia(
  guestAuth: GuestAuthentication,
  browserAuth: BrowserAuthentication,
  myUsername: string,
  outputDir: string,
  useCache: boolean,
  lastAtShortCodes: string[] = []
) {
  const profile = await instagram.getProfile(
    guestAuth,
    myUsername,
    useCache
  );

  const media = await instagram.getSavedMedia(
    browserAuth,
    profile,
    useCache,
    lastAtShortCodes
  );

  await download.downloadSavedMedia(guestAuth, media, outputDir, useCache);
}
