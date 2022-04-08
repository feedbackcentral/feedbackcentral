declare module "@feedbackcentral/types" {
  export type Organization = {
    id: string;
    name: string;
    projects: Project[];
  };

  export type Project = {
    id: string;
    name: string;
    description: string;
    tier: "free" | "pro";
    createdAt: Date;
    updatedAt: Date;
  };

  export type User = {
    id: string;
    username: string;
    login_methods: string[];
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
  };
}
