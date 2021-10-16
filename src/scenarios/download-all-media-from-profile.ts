import { join } from 'path';
import { promises as fs } from 'fs';

import * as download from '../download';
import * as instagram from '../instagram';
import { GuestAuthentication } from '../instagram';

export async function downloadAllMediaFromProfile(
  guestAuth: GuestAuthentication,
  username: string,
  outputDir: string,
  useCache: boolean
) {
  const profile = await instagram.getProfile(guestAuth, username, useCache);
  const media = await instagram.getProfileMedia(guestAuth, profile, useCache);

  const profileOutputDir = join(outputDir, username);
  await fs.mkdir(profileOutputDir, { recursive: true });
  await download.downloadProfileMedia(guestAuth, profile, media, profileOutputDir, useCache);
}
