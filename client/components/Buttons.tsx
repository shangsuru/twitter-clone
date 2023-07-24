"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

export const LoginButton = () => {
  return (
    <Button
      type="primary"
      shape="round"
      onClick={() => signIn("google")}
      danger
    >
      <GoogleOutlined /> Sign in with Google
    </Button>
  );
};

export const LogoutButton = () => {
  return (
    <Button type="primary" shape="round" onClick={() => signOut()}>
      Sign Out
    </Button>
  );
};

export const ProfileButton = ({ image, handle }: LoginDataProps) => {
  return (
    <Link href={`/profile/${handle}`}>
      <Avatar src={image} className="avatar" alt="Avatar" />
    </Link>
  );
};
