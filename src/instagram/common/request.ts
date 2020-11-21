import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { default as axios } from 'axios';

import { UserAgents } from './constants';
import { GuestAuthentication } from '../authenticate';

export async function get(
  auth: GuestAuthentication,
  url: string,
  gisData: string | undefined = undefined
): Promise<any> {
  let headers: any = {
    'Referer': 'https://www.instagram.com/',
    'X-CSRFToken': auth.csrfToken,
    'user-agent': UserAgents.chromeWin
  };

  if (gisData) {
    headers['x-instagram-gis'] = calculateGIS(gisData);
  }

  const response = await axios.get(url, { headers });
  return response.data;
}

function calculateGIS(data: string) {
  const rhx_gis = '';
  const hashData = `${rhx_gis}:${data}`;
  const hash = createHash('md5').update(hashData, 'utf8');
  return hash.digest('hex');
}

/// Tiny helper to save response to file.
export async function save(data: any) {
  const string = JSON.stringify(data);
  await fs.writeFile('./__response.json', string, 'utf-8');
}
