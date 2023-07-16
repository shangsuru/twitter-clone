"use client";

import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import UserCard from "@/components/UserCard";

type UserData = {
  username: string;
  handle: string;
  bio: string;
};

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

const items: TabsProps["items"] = [
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
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
}
