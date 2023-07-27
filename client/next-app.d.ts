import type { DefaultSession } from "next-auth";
import type { UploadFile } from "antd/es/upload/interface";

declare module "antd/es/upload/interface" {
  interface UploadFile<T = any> {
    base64?: string;
  }
}

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
    createdAt: number;
    followed?: boolean;
    following?: number;
    followers?: number;
    tweets?: TweetData[];
  }

  interface TweetData {
    id: string;
    image: string;
    sender: string;
    handle: string;
    text: string;
    createdAt: number;
    images: string[];
  }

  interface LoginDataProps {
    image: string;
    handle: string;
    JWT?: string;
  }
}

export {};
