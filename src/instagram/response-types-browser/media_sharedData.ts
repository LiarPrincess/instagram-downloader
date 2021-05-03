import { Shortcodemedia } from '../response-types/media';

export interface Root {
  config: Config;
  country_code: string;
  language_code: string;
  locale: string;
  entry_data: EntryData;
  hostname: string;
  is_whitelisted_crawl_bot: boolean;
  connection_quality_rating: string;
  deployment_stage: string;
  platform: string;
  nonce: string;
  mid_pct: number;
}

interface Config {
  csrf_token: string;
  viewer?: any;
  viewerId?: any;
}

export interface EntryData {
  LoginAndSignupPage: any | undefined;
  ProfilePage: ProfilePage[] | undefined;
  PostPage: PostPage[];
}

interface PostPage { // This is the data that we get from api.
  graphql: {
    shortcode_media: Shortcodemedia
  };
}

interface ProfilePage {
  logging_page_id: string;
  show_suggested_profiles: boolean;
  show_follow_dialog: boolean;
  graphql: {
    user: User;
  };
  toast_content_on_load?: any;
  show_view_shop: boolean;
  profile_pic_edit_sync_props?: any;
  always_show_message_button_to_pro_account: boolean;
}

interface User {
  biography: string;
  // blocked_by_viewer: boolean;
  // restricted_by_viewer?: any;
  // country_block: boolean;
  // external_url: string;
  // external_url_linkshimmed: string;
  // edge_followed_by: EdgeFollowedBy;
  // fbid: string;
  // followed_by_viewer: boolean;
  // edge_follow: EdgeFollow;
  // follows_viewer: boolean;
  full_name: string;
  // has_ar_effects: boolean;
  // has_clips: boolean;
  // has_guides: boolean;
  // has_channel: boolean;
  // has_blocked_viewer: boolean;
  // highlight_reel_count: number;
  // has_requested_viewer: boolean;
  id: string;
  // is_business_account: boolean;
  // is_professional_account: boolean;
  // is_joined_recently: boolean;
  // business_category_name?: any;
  // overall_category_name?: any;
  // category_enum?: any;
  // category_name?: any;
  is_private: boolean;
  // is_verified: boolean;
  // edge_mutual_followed_by: EdgeMutualFollowedBy;
  // profile_pic_url: string;
  // profile_pic_url_hd: string;
  // requested_by_viewer: boolean;
  // should_show_category: boolean;
  // should_show_public_contacts: boolean;
  username: string;
  // connected_fb_page?: any;
  // edge_felix_video_timeline: EdgeFelixVideoTimeline;
  // edge_owner_to_timeline_media: EdgeOwnerToTimelineMedia;
  // edge_saved_media: EdgeSavedMedia;
  // edge_media_collections: EdgeMediaCollections;
  // edge_related_profiles: EdgeRelatedProfiles;
}
