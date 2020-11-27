export interface UserSavedResponse {
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

export interface EdgeLikedBy {
  count: number;
}

export interface EdgeMediaPreviewLike {
  count: number;
}

export interface Owner {
  id: string;
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
  edge_liked_by: EdgeLikedBy;
  edge_media_preview_like: EdgeMediaPreviewLike;
  owner: Owner;
  thumbnail_src: string;
  is_video: boolean;
  accessibility_caption: string;
  video_view_count?: number;
  product_type: string;
}

export interface Edge {
  node: Node;
}

export interface EdgeSavedMedia {
  count: number;
  page_info: PageInfo;
  edges: Edge[];
}

export interface User {
  edge_saved_media: EdgeSavedMedia;
}

export interface Data {
  user: User;
}
