import { Shortcodemedia } from '../response-types/media';

export interface MediaSharedData {
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

interface EntryData {
  LoginAndSignupPage: any | undefined;
  PostPage: PostPage[];
}

interface PostPage { // This is the data that we get from api.
  graphql: Graphql;
}

interface Graphql {
  shortcode_media: Shortcodemedia;
}
