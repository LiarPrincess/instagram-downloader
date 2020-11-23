import { getJSON } from './common/request';
import { GuestAuthentication } from './authenticate';
import { ProfileResponse } from './response-types/profile-response';

import * as cache from '../cache';

export interface Profile {
  readonly id: string;
  readonly fullName: string;
  readonly username: string;
  readonly biography: string;
  readonly isPrivate: boolean;

  readonly profilePic: {
    url: string,
    hdUrl: string
  };

  readonly followersCount: number;
  readonly followingCount: number;
  readonly postCount: number;
}

export async function getProfile(
  auth: GuestAuthentication,
  username: string,
  useCache: boolean
): Promise<Profile> {
  const response = await get(auth, username, useCache);
  const user = response.graphql.user;

  return {
    id: user.id,
    username,
    fullName: user.full_name,
    biography: user.biography,
    isPrivate: user.is_private,

    profilePic: {
      url: user.profile_pic_url,
      hdUrl: user.profile_pic_url_hd
    },

    followersCount: user.edge_followed_by.count,
    followingCount: user.edge_follow.count,
    postCount: user.edge_owner_to_timeline_media.count
  };
}

async function get(
  auth: GuestAuthentication,
  username: string,
  useCache: boolean
): Promise<ProfileResponse> {
  const cacheKey = `${username}_profile.json`;

  if (useCache) {
    const string = await cache.get(cacheKey);
    if (string) {
      const result = JSON.parse(string);
      return result;
    }
  }

  const url = `https://www.instagram.com/${username}/?__a=1`;
  const response = await getJSON(auth, url);
  await cache.put(cacheKey, JSON.stringify(response));

  return response;
}
