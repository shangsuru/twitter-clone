import type { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    loggedUser?: string;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    token?: string;
  }
}

declare global {
  interface UserData {
    image: string;
    username: string;
    handle: string;
    bio: string;
    location?: string;
    website?: string;
    createdAt?: number;
    following_count?: number;
    followers_count?: number;
  }

  interface TweetData {
    sender: string;
    handle: string;
    text: string;
    createdAt: number;
  }

  interface LoginDataProps {
    image: string;
    handle: string;
  }
}

export {};
