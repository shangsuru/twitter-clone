"use client";

import React from "react";
import { Tabs } from "antd";
import type { Tab } from "rc-tabs/lib/interface";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import UserCard from "@/components/UserCard";
import Header from "@/components/Header";
import { AntdStyle } from "../AntdStyle";

const followers: UserData[] = [
  {
    username: "Gynvael Coldwind",
    handle: "@gynvael",
    bio: "security researcher/programmer. DragonSector CTF. youtube.com/@GynvaelEN",
  },
  {
    username: "John Hammond",
    handle: "@_JohnHammond",
    bio: "Hacker. Friend. Cybersecurity Researcher",
  },
];

const following: UserData[] = [
  {
    username: "Yaron (Ron) Minsky",
    handle: "@yminsky",
    bio: "Occasional OCaml programmer. Host of @signalsthreads",
  },
  {
    username: "DevSecCon",
    handle: "@devseccon",
    bio: "Community for developers, operators & security people to share their views & practices on DevSecOps",
  },
  {
    username: "Clint Gibler",
    handle: "@clintgibler",
    bio: "Head of Security Research @semgrep. Creator of tldrsec.com newsletter",
  },
];

const onChange = (key: string) => {
  console.log(key);
};

const items: Tab[] = [
  {
    key: "1",
    label: "Followers",
    children: followers.map((user) => (
      <UserCard
        key={user.handle}
        username={user.username}
        handle={user.handle}
        bio={user.bio}
      />
    )),
  },
  {
    key: "2",
    label: "Following",
    children: following.map((user) => (
      <UserCard
        key={user.handle}
        username={user.username}
        handle={user.handle}
        bio={user.bio}
      />
    )),
  },
];

export default function Follow() {
  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!data || !data.user || !data.user.email) {
    signOut();
    redirect("/login");
  }

  const image = data.user.image ?? "/user_icon.png";
  const handle = data.user.email.split("@")[0];

  return (
    <AntdStyle>
      <Header image={image} handle={handle} />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </AntdStyle>
  );
}
