import { get } from './common/request';
import { Urls } from './common/constants';
import { GuestAuthentication } from './authenticate';
import { ProfileResponse } from './response-types/profile-response';

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

export async function getProfile(auth: GuestAuthentication, username: string): Promise<Profile> {
  const url = `https://www.instagram.com/${username}/?__a=1`;
  const response = await get(auth, url) as ProfileResponse;
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
