export interface Root {
  data: Data;
  status: string;
}

export interface PageInfo {
  has_next_page: boolean;
  end_cursor: string;
}

export interface Node2 {
  text: string;
}

export interface Edge2 {
  node: Node2;
}

export interface EdgeMediaToCaption {
  edges: Edge2[];
}

export interface EdgeMediaToComment {
  count: number;
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface EdgeMediaPreviewLike {
  count: number;
}

export interface Owner {
  id: string;
}

export interface ThumbnailResource {
  src: string;
  config_width: number;
  config_height: number;
}

export interface Node {
  id: string;
  __typename: string;
  edge_media_to_caption: EdgeMediaToCaption;
  shortcode: string;
  edge_media_to_comment: EdgeMediaToComment;
  comments_disabled: boolean;
  taken_at_timestamp: number;
  dimensions: Dimensions;
  display_url: string;
  edge_media_preview_like: EdgeMediaPreviewLike;
  gating_info?: any;
  media_preview: string | null;
  owner: Owner;
  thumbnail_src: string;
  thumbnail_resources: ThumbnailResource[];
  is_video: boolean;
  video_url?: string;
}

export interface Edge {
  node: Node;
}

export interface EdgeOwnerToTimelineMedia {
  count: number;
  page_info: PageInfo;
  edges: Edge[];
}

export interface User {
  edge_owner_to_timeline_media: EdgeOwnerToTimelineMedia;
}

export interface Data {
  user: User;
}
