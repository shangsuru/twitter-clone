declare global {
  interface UserData {
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
