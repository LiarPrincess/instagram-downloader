export interface Root {
  logging_page_id: string;
  show_suggested_profiles: boolean;
  show_follow_dialog: boolean;
  graphql: Graphql;
  toast_content_on_load?: any;
  show_view_shop: boolean;
  profile_pic_edit_sync_props?: any;
}

export interface Graphql {
  user: User2;
}

export interface User2 {
  biography: string;
  blocked_by_viewer: boolean;
  restricted_by_viewer?: any;
  country_block: boolean;
  external_url: string;
  external_url_linkshimmed: string;
  edge_followed_by: Edgefollowedby;
  followed_by_viewer: boolean;
  edge_follow: Edgefollowedby;
  follows_viewer: boolean;
  full_name: string;
  has_ar_effects: boolean;
  has_clips: boolean;
  has_guides: boolean;
  has_channel: boolean;
  has_blocked_viewer: boolean;
  highlight_reel_count: number;
  has_requested_viewer: boolean;
  id: string;
  is_business_account: boolean;
  is_joined_recently: boolean;
  business_category_name: string;
  overall_category_name?: any;
  category_enum: string;
  is_private: boolean;
  is_verified: boolean;
  edge_mutual_followed_by: Edgemutualfollowedby;
  profile_pic_url: string;
  profile_pic_url_hd: string;
  requested_by_viewer: boolean;
  username: string;
  connected_fb_page?: any;
  edge_felix_video_timeline: Edgefelixvideotimeline;
  edge_owner_to_timeline_media: Edgeownertotimelinemedia;
  edge_saved_media: Edgesavedmedia;
  edge_media_collections: Edgesavedmedia;
  edge_related_profiles: Edgerelatedprofiles;
}

export interface Edgerelatedprofiles {
  edges: Edge6[];
}

export interface Edge6 {
  node: Node6;
}

export interface Node6 {
  id: string;
  full_name: string;
  is_private: boolean;
  is_verified: boolean;
  profile_pic_url: string;
  username: string;
}

export interface Edgesavedmedia {
  count: number;
  page_info: Pageinfo2;
  edges: any[];
}

export interface Pageinfo2 {
  has_next_page: boolean;
  end_cursor?: any;
}

export interface Edgeownertotimelinemedia {
  count: number;
  page_info: Pageinfo;
  edges: Edge5[];
}

export interface Edge5 {
  node: Node5;
}

export interface Node5 {
  __typename: string;
  id: string;
  shortcode: string;
  dimensions: Dimensions;
  display_url: string;
  edge_media_to_tagged_user: Edgemediatotaggeduser2;
  fact_check_overall_rating?: any;
  fact_check_information?: any;
  gating_info?: any;
  sharing_friction_info: Sharingfrictioninfo;
  media_overlay_info?: any;
  media_preview?: string;
  owner: Owner;
  is_video: boolean;
  accessibility_caption: string;
  edge_media_to_caption: Edgemediatocaption;
  edge_media_to_comment: Edgefollowedby;
  comments_disabled: boolean;
  taken_at_timestamp: number;
  edge_liked_by: Edgefollowedby;
  edge_media_preview_like: Edgefollowedby;
  location?: Location;
  thumbnail_src: string;
  thumbnail_resources: Thumbnailresource[];
  edge_sidecar_to_children?: Edgesidecartochildren;
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
  display_url: string;
  edge_media_to_tagged_user: Edgemediatotaggeduser3;
  fact_check_overall_rating?: any;
  fact_check_information?: any;
  gating_info?: any;
  sharing_friction_info: Sharingfrictioninfo;
  media_overlay_info?: any;
  media_preview: string;
  owner: Owner;
  is_video: boolean;
  accessibility_caption?: string | string;
  dash_info?: Dashinfo;
  has_audio?: boolean;
  tracking_token?: string;
  video_url?: string;
  video_view_count?: number;
}

export interface Edgemediatotaggeduser3 {
  edges: Edge3[][];
}

export interface Location {
  id: string;
  has_public_page: boolean;
  name: string;
  slug: string;
}

export interface Edgemediatotaggeduser2 {
  edges: Edge3[];
}

export interface Edge3 {
  node: Node3;
}

export interface Node3 {
  user: User;
  x: number;
  y: number;
}

export interface User {
  full_name: string;
  id: string;
  is_verified: boolean;
  profile_pic_url: string;
  username: string;
}

export interface Edgefelixvideotimeline {
  count: number;
  page_info: Pageinfo;
  edges: Edge2[];
}

export interface Edge2 {
  node: Node2;
}

export interface Node2 {
  __typename: string;
  id: string;
  shortcode: string;
  dimensions: Dimensions;
  display_url: string;
  edge_media_to_tagged_user: Edgemediatotaggeduser;
  fact_check_overall_rating?: any;
  fact_check_information?: any;
  gating_info?: any;
  sharing_friction_info: Sharingfrictioninfo;
  media_overlay_info?: any;
  media_preview?: string;
  owner: Owner;
  is_video: boolean;
  accessibility_caption?: any;
  dash_info: Dashinfo;
  has_audio: boolean;
  tracking_token: string;
  video_url: string;
  video_view_count: number;
  edge_media_to_caption: Edgemediatocaption;
  edge_media_to_comment: Edgefollowedby;
  comments_disabled: boolean;
  taken_at_timestamp: number;
  edge_liked_by: Edgefollowedby;
  edge_media_preview_like: Edgefollowedby;
  location?: any;
  thumbnail_src: string;
  thumbnail_resources: Thumbnailresource[];
  felix_profile_grid_crop?: Felixprofilegridcrop;
  encoding_status?: any;
  is_published: boolean;
  product_type: string;
  title: string;
  video_duration: number;
}

export interface Felixprofilegridcrop {
  crop_left: number;
  crop_right: number;
  crop_top: number;
  crop_bottom: number;
}

export interface Thumbnailresource {
  src: string;
  config_width: number;
  config_height: number;
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

export interface Dashinfo {
  is_dash_eligible: boolean;
  video_dash_manifest?: any;
  number_of_qualities: number;
}

export interface Owner {
  id: string;
  username: string;
}

export interface Sharingfrictioninfo {
  should_have_sharing_friction: boolean;
  bloks_app_url?: any;
}

export interface Edgemediatotaggeduser {
  edges: any[];
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface Pageinfo {
  has_next_page: boolean;
  end_cursor: string;
}

export interface Edgemutualfollowedby {
  count: number;
  edges: any[];
}

export interface Edgefollowedby {
  count: number;
}
