import { stringify } from "https://deno.land/x/querystring@v1.0.2/mod.js";

export class TwitterClient {
  constructor(
    private bearerToken: string,
    private baseUrl = "https://api.twitter.com/2/"
  ) {}

  async getUserByUsername(username: string) {
    return await this._get<User>(`users/by/username/${username}`);
  }

  async getMentionsByUserId(
    userId: string,
    params?: { "tweet.fields": (keyof Tweet)[] } & Record<string, any>
  ) {
    return await this._get<Tweet[]>(`users/${userId}/mentions`, params);
  }

  private async _get<T>(path: string, params?: Record<string, any>) {
    const fetchUrl = `${this.baseUrl}${path}${
      params ? "?" + stringify(params, { arrayFormat: "comma" }) : ""
    }`;

    return (await (
      await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${this.bearerToken}`,
        },
      })
    ).json()) as { data: T };
  }
}

interface User {
  id: string;
  name: string;
  username: string;
}

export interface Tweet {
  /**
   * The unique identifier of the requested Tweet
   */
  id: string;

  /**
   * The actual `UTF-8` text of the Tweet
   */
  text: string;

  /**
   * The type of attachments (if any) present in the Tweet
   */
  attachments?: APITweetAttachments;

  /**
   * The unique identifier of the User who posted the Tweet
   */
  author_id?: string;

  /**
   * Contains context annotations for the Tweet
   */
  context_annotations?: Array<APITweetContextAnnotation>;

  /**
   * The ID of the original Tweet of the conversation (which includes direct replies, replies of replies)
   */
  conversation_id?: string;

  /**
   * The `ISO 8601` creation time of the Tweet
   */
  created_at?: string;

  /**
   * The entities which have been parsed out of the text of the Tweet
   */
  entities?: APITweetEntities;

  /**
   * The details about the location tagged by the user in the Tweet, if they specified one
   */
  geo?: APITweetGeo;

  /**
   * If the Tweet is a reply, this field will contain the original Tweet’s author ID.
   * This will not necessarily always be the user directly mentioned in the Tweet
   */
  in_reply_to_user_id?: string;

  /**
   * The language of the Tweet, if detected by Twitter. Returned as a `BCP47` language tag
   */
  lang?: string;

  /**
   * Non-public engagement metrics for the Tweet at the time of the request.
   * Requires user context authentication
   */
  non_public_metrics?: APITweetNonPublicMetrics;

  /**
   * Engagement metrics tracked in an organic context for the Tweet at the time of the request.
   * Requires user context authentication
   */
  organic_metrics?: APITweetOrganicMetrics;

  /**
   * This field only surfaces when a Tweet contains a link. The meaning of the field doesn’t pertain
   * to the Tweet content itself, but instead it is an indicator that the URL contained in the Tweet
   * may contain content or media identified as sensitive content
   */
  possibly_sensitive?: boolean;

  /**
   * Engagement metrics tracked in a promoted context for the Tweet at the time of the request.
   * Requires user context authentication
   */
  promoted_metrics?: APITweetPromotedMetrics;

  /**
   * Public engagement metrics for the Tweet at the time of the request
   */
  public_metrics?: APITweetPublicMetrics;

  /**
   * A list of Tweets this Tweet refers to. It will also include the related Tweet referenced to by its parent
   */
  referenced_tweets?: Array<APITweetReferencedTweet>;

  /**
   * Shows who can reply to the Tweet
   */
  reply_settings?: APITweetReplySettings;

  /**
   * The name of the app the user Tweeted from
   */
  source?: string;

  /**
   * When present, contains withholding details for withheld content
   *
   * See https://help.twitter.com/en/rules-and-policies/tweet-withheld-by-country
   */
  withheld?: APITweetWithheld;
}

export interface APITweetAnnotationEntity extends APITweetBaseEntity {
  probability: number;
  type: string;
  normalized_text: string;
}

export interface APITweetAttachments {
  media_keys?: Array<string>;
  poll_ids?: Array<string>;
}

export interface APITweetBaseEntity {
  start: number;
  end: number;
}

export interface APITweetCashtagEntity extends APITweetBaseEntity {
  tag: string;
}

export interface APITweetContextAnnotation {
  domain: APITweetContextAnnotationDomain;
  entity: APITweetContextAnnotationEntity;
}

export interface APITweetContextAnnotationDomain {
  id: string;
  name: string;
  description: string;
}

export interface APITweetContextAnnotationEntity {
  id: string;
  name: string;
  description: string;
}

export interface APITweetEntities {
  annotations?: Array<APITweetAnnotationEntity>;
  cashtags?: Array<APITweetCashtagEntity>;
  hashtags?: Array<APITweetHashtagEntity>;
  mentions?: Array<APITweetMentionEntity>;
  urls?: Array<APITweetURLEntity>;
}

export interface APITweetGeo {
  coordinates?: APITweetGeoCoordinates;
  place_id: string;
}

export interface APITweetGeoCoordinates {
  type: "Point";
  coordinates: [number, number] | null;
}

export interface APITweetHashtagEntity extends APITweetBaseEntity {
  tag: string;
}

export interface APITweetMentionEntity extends APITweetBaseEntity {
  username: string;
  id: string;
}

export interface APITweetNonPublicMetrics {
  impression_count: number;
  url_link_clicks?: number;
  user_profile_clicks: number;
}

export interface APITweetOrganicMetrics {
  impression_count: number;
  like_count: number;
  reply_count: number;
  retweet_count: number;
  url_link_clicks?: number;
  user_profile_clicks: number;
}

export interface APITweetPromotedMetrics extends APITweetOrganicMetrics {}

export interface APITweetPublicMetrics {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
}

export type APITweetReplySettings =
  | "everyone"
  | "mentioned_users"
  | "followers";

export interface APITweetReferencedTweet {
  type: APITweetReferencedTweetType;
  id: string;
}

export type APITweetReferencedTweetType = "retweeted" | "quoted" | "replied_to";

export interface APITweetURLEntity extends APITweetBaseEntity {
  url: string;
  expanded_url: string;
  display_url: string;
  status: string;
  title: string;
  description: string;
  unwound_url: string;
}

export interface APITweetWithheld {
  /**
   * Indicates if the content is being withheld for on the basis of copyright infringement
   */
  copyright: boolean;

  /**
   * Provides a list of countries where this content is not available
   */
  country_codes: Array<string>;

  /**
   * Indicates whether the content being withheld is the `tweet` or a `user`
   */
  scope?: string;
}