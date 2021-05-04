export interface Root {
  graphql: Graphql;
}

export interface Graphql {
  shortcode_media: Shortcodemedia;
}

export interface Shortcodemedia {
  __typename: string;
  id: string;
  shortcode: string;
  dimensions: Dimensions;
  gating_info?: any;
  fact_check_overall_rating?: any;
  fact_check_information?: any;
  sensitivity_friction_info?: any;
  sharing_friction_info: Sharingfrictioninfo;
  media_overlay_info?: any;
  media_preview?: any;
  display_url: string;
  display_resources: DisplayResource[];
  is_video: boolean;
  video_url: string;
  tracking_token: string;
  edge_media_to_tagged_user: Edgemediatotaggeduser;
  edge_media_to_caption: Edgemediatocaption;
  caption_is_edited: boolean;
  has_ranked_comments: boolean;
  edge_media_to_parent_comment: Edgemediatoparentcomment;
  edge_media_to_hoisted_comment: Edgemediatotaggeduser;
  edge_media_preview_comment: Edgemediapreviewcomment;
  comments_disabled: boolean;
  commenting_disabled_for_viewer: boolean;
  taken_at_timestamp: number;
  edge_media_preview_like: Edgemediapreviewlike;
  edge_media_to_sponsor_user: Edgemediatotaggeduser;
  location?: any;
  viewer_has_liked: boolean;
  viewer_has_saved: boolean;
  viewer_has_saved_to_collection: boolean;
  viewer_in_photo_of_you: boolean;
  viewer_can_reshare: boolean;
  owner: Owner2;
  is_ad: boolean;
  edge_web_media_to_related_media: Edgemediatotaggeduser;
  edge_sidecar_to_children: Edgesidecartochildren;
  edge_related_profiles: Edgemediatotaggeduser;
}

export interface Edgesidecartochildren {
  edges: Edge4[];
}

export interface Edge4 {
  node: Node4;
}

export interface Node4 {
  __typename: string;
  id: string;
  shortcode: string;
  dimensions: Dimensions;
  gating_info?: any;
  fact_check_overall_rating?: any;
  fact_check_information?: any;
  sensitivity_friction_info?: any;
  sharing_friction_info: Sharingfrictioninfo;
  media_overlay_info?: any;
  media_preview: string;
  display_url: string;
  display_resources: DisplayResource[];
  accessibility_caption: string;
  is_video: boolean;
  tracking_token: string;
  video_url: string;
  edge_media_to_tagged_user: Edgemediatotaggeduser;
}

export interface Owner2 {
  id: string;
  is_verified: boolean;
  profile_pic_url: string;
  username: string;
  blocked_by_viewer: boolean;
  restricted_by_viewer?: any;
  followed_by_viewer: boolean;
  full_name: string;
  has_blocked_viewer: boolean;
  is_private: boolean;
  is_unpublished: boolean;
  requested_by_viewer: boolean;
  pass_tiering_recommendation: boolean;
  edge_owner_to_timeline_media: Edgelikedby;
  edge_followed_by: Edgelikedby;
}

export interface Edgemediapreviewlike {
  count: number;
  edges: any[];
}

export interface Edgemediapreviewcomment {
  count: number;
  edges: Edge3[];
}

export interface Edge3 {
  node: Node3;
}

export interface Node3 {
  id: string;
  text: string;
  created_at: number;
  did_report_as_spam: boolean;
  owner: Owner;
  viewer_has_liked: boolean;
  edge_liked_by: Edgelikedby;
  is_restricted_pending: boolean;
}

export interface Edgemediatoparentcomment {
  count: number;
  page_info: Pageinfo;
  edges: Edge2[];
}

export interface Edge2 {
  node: Node2;
}

export interface Node2 {
  id: string;
  text: string;
  created_at: number;
  did_report_as_spam: boolean;
  owner: Owner;
  viewer_has_liked: boolean;
  edge_liked_by: Edgelikedby;
  is_restricted_pending: boolean;
  edge_threaded_comments: Edgethreadedcomments;
}

export interface Edgethreadedcomments {
  count: number;
  page_info: Pageinfo2;
  edges: any[];
}

export interface Pageinfo2 {
  has_next_page: boolean;
  end_cursor?: any;
}

export interface Edgelikedby {
  count: number;
}

export interface Owner {
  id: string;
  is_verified: boolean;
  profile_pic_url: string;
  username: string;
}

export interface Pageinfo {
  has_next_page: boolean;
  end_cursor: string;
}

export interface Edgemediatocaption {
  edges: Edge[];
}

export interface Edge {
  node: Node;
}

export interface Node {
  text: string;
}

export interface Edgemediatotaggeduser {
  edges: any[];
}

export interface DisplayResource {
  src: string;
  config_width: number;
  config_height: number;
}

export interface Sharingfrictioninfo {
  should_have_sharing_friction: boolean;
  bloks_app_url?: any;
}

export interface Dimensions {
  height: number;
  width: number;
}
