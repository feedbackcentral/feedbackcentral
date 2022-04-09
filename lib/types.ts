export type Organization = {
  id: string;
  name: string;
  projects: Project[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  feedbacks: Feedback[];
  tier: ProjectTier;
  createdAt: Date;
  updatedAt: Date;
};

export type Feedback = {
  id: number;
  content: string;
  author: string;
  relevance: number;
  source: FeedbackSource;
  language: Language;
  createdAt: Date;
  answeredAt?: Date;
};

export type User = {
  id: string;
  username: string;
  login_methods: string[];
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
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
