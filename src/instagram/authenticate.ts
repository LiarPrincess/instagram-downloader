import { default as axios } from 'axios';

import { UserAgents } from './common/UserAgents';

const baseUrl = 'https://www.instagram.com/';
const loginUrl = baseUrl + 'accounts/login/ajax/';

/// Log into Instagram in the browser and copy cookie values.
export interface BrowserAuthentication {
  readonly sessionId: string;
  readonly csrfToken: string;
}

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
