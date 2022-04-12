export type Organization = {
  id: string;
  name: string;
  projects: Project[];
};

// export type Project = {
//   id: string;
//   name: string;
//   description: string;
//   feedbacks: Feedback[];
//   tier: ProjectTier;
//   createdAt: Date;
//   updatedAt: Date;
// };

export type Project = {
  id: string;
  name: string;
  owner_id: string;
  tier: ProjectTier;
  flags: 0;
};

// export type Feedback = {
//   id: number;
//   content: string;
//   author: string;
//   relevance: number;
//   source: FeedbackSource;
//   language: Language;
//   createdAt: Date;
//   answeredAt?: Date;
// };

export type Feedback = {
  id: string;
  content: string;
  source: string;
  source_meta: any;
  classification?: string;
  project_id: string;
  created_at: string;
};

export type Source = {
  id: string;
  created_at: Date;
  type: "twitter_mention";
  parameters: {
    username: string;
  };
  project_id: string;
  last_run_at: Date;
  next_run_at: Date;
};

export type User = {
  id: string;
  username: string;
  login_methods: string[];
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
};

export type Profile = {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  login_methods: string[];
};

export enum ProjectTier {
  FREE = "FREE",
  PRO = "PRO",
}

export enum FeedbackSource {
  TWITTER = "TWITTER",
}

export enum Language {
  ENGLISH = "ENGLISH",
}
