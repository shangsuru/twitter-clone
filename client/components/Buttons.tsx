"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

export const LoginButton = () => {
  return (
    <Button type="primary" shape="round" onClick={() => signIn()} danger>
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

export const ProfileButton = ({
  image,
  handle,
}: {
  image: string;
  handle: string;
}) => {
  return (
    <Link href={`/profile/${handle}`}>
      <Avatar src={image} className="avatar" />
    </Link>
  );
};
