"use client";

import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

import { AntdStyle } from "@/app/AntdStyle";
import TweetCard from "@/components/TweetCard";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Header from "@/components/Header";

type TweetData = {
  sender: string;
  handle: string;
  text: string;
  created_at: number;
};

const all: TweetData[] = [
  {
    sender: "Gynvael Coldwind",
    handle: "@gynvael",
    text: "Friday was my last day at Google. I'm saddened to leave behind my team of last 12+ years, but I know Google Security is in great hands.  It's time for a short break and then I'm moving on with plans I've made long ago - my own sec research, consulting, and education company.",
    created_at: 1689317981,
  },
  {
    sender: "John Hammond",
    handle: "@_JohnHammond",
    text: "For another fireworks show, Ignacio Dominguez and Carlos Polop from HALBORN showcase how dependency confusion attacks can occur with the AWS Code Artifact service -- potentially even having npm execute rogue code just upon install!",
    created_at: 1689315000,
  },
  {
    sender: "Yaron (Ron) Minsky",
    handle: "@yminsky",
    text: "So...does anyone have advice for picking between the various and sundry Python type systems? mypy, pyright, pyre, pytype...how do you pick?",
    created_at: 1689299980,
  },
  {
    sender: "DevSecCon",
    handle: "@devseccon",
    text: "Missed the interactive workshop on OWASP TOP 10 Security API 2023 x GraphQL at DSC24? Watch now...",
    created_at: 1681447919,
  },
  {
    sender: "Clint Gibler",
    handle: "@clintgibler",
    text: "findmytakeover scans aws, azure, and google cloud for dangling DNS records and potential subdomain takeovers #cloudsec",
    created_at: 1586839919,
  },
];

const following: TweetData[] = [
  {
    sender: "Yaron (Ron) Minsky",
    handle: "@yminsky",
    text: "So...does anyone have advice for picking between the various and sundry Python type systems? mypy, pyright, pyre, pytype...how do you pick?",
    created_at: 1689299980,
  },
  {
    sender: "DevSecCon",
    handle: "@devseccon",
    text: "Missed the interactive workshop on OWASP TOP 10 Security API 2023 x GraphQL at DSC24? Watch now...",
    created_at: 1681447919,
  },
  {
    sender: "Clint Gibler",
    handle: "@clintgibler",
    text: "findmytakeover scans aws, azure, and google cloud for dangling DNS records and potential subdomain takeovers #cloudsec",
    created_at: 1586839919,
  },
];

function onChange(key: string) {
  console.log(key);
}

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Following",
    children: following.map((tweet) => (
      <TweetCard
        key={tweet.handle}
        sender={tweet.sender}
        handle={tweet.handle}
        text={tweet.text}
        created_at={tweet.created_at}
      />
    )),
  },
  {
    key: "2",
    label: "All",
    children: all.map((tweet) => (
      <TweetCard
        key={tweet.handle}
        sender={tweet.sender}
        handle={tweet.handle}
        text={tweet.text}
        created_at={tweet.created_at}
      />
    )),
  },
];

export default function Feed() {
  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const image = data?.user?.image ?? "/user_icon.png";
  const handle = data?.user?.email!.split("@")[0];

  return (
    <AntdStyle>
      <Header image={image} handle={handle!} />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </AntdStyle>
  );
}
