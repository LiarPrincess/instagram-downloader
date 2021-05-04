import { Profile, ApiResponse } from './types';

export function parseApiResponse(response: ApiResponse.Root): Profile {
  const user = response.graphql.user;
  return {
    id: user.id,
    username: user.username,
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
