import { default as axios } from 'axios';

import { Urls, UserAgents } from './common/constants';

const baseUrl = 'https://www.instagram.com/';

export interface GuestAuthentication {
  readonly csrfToken: string;
}

export async function authenticateAsGuest(): Promise<GuestAuthentication> {
  const response = await axios.get(baseUrl, {
    headers: {
      'Referer': baseUrl,
      'user-agent': UserAgents.stories
    }
  });

  const cookies = response.headers['set-cookie'];
  const csrfToken = getCSRFToken(cookies);
  return { csrfToken };
}

function getCSRFToken(cookies: string[]): string {
  const regex = /csrftoken=(\w*);/;
  for (const string of cookies) {
    const result = regex.exec(string);
    if (result) {
      return result[1];
    }
  }

  throw new Error('Unable to obtain CSRF token from authentication response.');
}