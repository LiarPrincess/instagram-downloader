import { createHash } from 'crypto';
import { default as axios } from 'axios';

import { UserAgents } from './UserAgents';
import { GuestAuthentication } from '../authenticate';

export async function getJSON(
  auth: GuestAuthentication,
  url: string,
  gisData: string | undefined = undefined
): Promise<any> {
  const headers: any = {
    'Referer': 'https://www.instagram.com/',
    'X-CSRFToken': auth.csrfToken,
    'user-agent': UserAgents.chromeWin
  };

  if (gisData) {
    headers['x-instagram-gis'] = calculateGIS(gisData);
  }

  const response = await axios.get(url, { headers });

  const contentType = response.headers['content-type'] as string;
  if (!contentType.includes('json')) {
    throw new Error(`Invalid response content type: '${contentType}' (expected json).`);
  }

  return response.data;
}

function calculateGIS(data: string) {
  const rhx_gis = '';
  const hashData = `${rhx_gis}:${data}`;
  const hash = createHash('md5').update(hashData, 'utf8');
  return hash.digest('hex');
}
