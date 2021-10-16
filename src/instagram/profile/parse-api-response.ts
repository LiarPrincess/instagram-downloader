import { Profile, ApiResponse } from './types';

export function parseApiResponse(response: ApiResponse.Root): Profile {
  const user = response.graphql.user;
  return new Profile(
    user.id,
    user.username,
    user.full_name,
    user.biography,
    user.is_private,
    {
      url: user.profile_pic_url,
      urlHd: user.profile_pic_url_hd
    },
    user.edge_followed_by.count,
    user.edge_follow.count,
    user.edge_owner_to_timeline_media.count
  );
}
