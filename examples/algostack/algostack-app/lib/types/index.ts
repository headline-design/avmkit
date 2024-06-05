export interface UserProps {
    id: string;
    name: string;
    username: string;
    gh_username: string;
    email: string;
    image?: string;
    createdAt: Date;
    role: "owner" | "member";
    projects?: { projectId: string }[];
  }