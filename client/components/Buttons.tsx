"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, Button } from "antd";

export const LoginButton = () => {
  return (
    <Button style={{ marginRight: 10 }} onClick={() => signIn()}>
      Sign in
    </Button>
  );
};

export const LogoutButton = () => {
  return (
    <Button style={{ marginRight: 10 }} onClick={() => signOut()}>
      Sign Out
    </Button>
  );
};

export const ProfileButton = () => {
  return (
    <Link href="/profile">
      <Avatar
        src="https://yt3.googleusercontent.com/6FqcWoHZvrZixaGi1S3Re3Z90SCS3iq2_36hQSnSHQPtQVVkywH8WKka53MiBYBSP6DmqM-g9w=s900-c-k-c0x00ffffff-no-rj"
        className="avatar"
      />
    </Link>
  );
};
