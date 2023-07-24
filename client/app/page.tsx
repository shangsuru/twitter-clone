"use client";

import { useState, useEffect } from "react";
import { Tabs } from "antd";
import type { Tab } from "rc-tabs/lib/interface";

import { AntdStyle } from "@/app/AntdStyle";
import TweetCard from "@/components/TweetCard";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Header from "@/components/Header";

const following: TweetData[] = [
  {
    id: "1",
    sender: "Yaron (Ron) Minsky",
    handle: "yminsky",
    text: "So...does anyone have advice for picking between the various and sundry Python type systems? mypy, pyright, pyre, pytype...how do you pick?",
    createdAt: 1689299980,
    image: "",
  },
  {
    id: "2",
    sender: "DevSecCon",
    handle: "devseccon",
    text: "Missed the interactive workshop on OWASP TOP 10 Security API 2023 x GraphQL at DSC24? Watch now...",
    createdAt: 1681447919,
    image: "",
  },
  {
    id: "3",
    sender: "Clint Gibler",
    handle: "clintgibler",
    text: "findmytakeover scans aws, azure, and google cloud for dangling DNS records and potential subdomain takeovers #cloudsec",
    createdAt: 1586839919,
    image: "",
  },
];

export default function Feed() {
  const [allTweets, setAllTweets] = useState<TweetData[]>([]);

  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  useEffect(() => {
    fetch(`${process.env.PUBLIC_API_URL}/tweets`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllTweets(data);
      });
  }, []);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!data || !data.user || !data.user.email) {
    signOut();
    redirect("/login");
  }

  const items: Tab[] = [
    {
      key: "1",
      label: "Following",
      children: following.map((tweet) => (
        <TweetCard
          key={tweet.id}
          sender={tweet.sender}
          handle={tweet.handle}
          text={tweet.text}
          image={tweet.image}
          createdAt={tweet.createdAt}
        />
      )),
    },
    {
      key: "2",
      label: "All",
      children: allTweets.map((tweet) => (
        <TweetCard
          key={tweet.id}
          sender={tweet.sender}
          handle={tweet.handle}
          text={tweet.text}
          image={tweet.image}
          createdAt={tweet.createdAt}
        />
      )),
    },
  ];

  const image = data.user.image ?? "/user_icon.png";
  const handle = data.user.email.split("@")[0];

  return (
    <AntdStyle>
      <Header image={image} handle={handle} JWT={data.token} />
      <Tabs defaultActiveKey="1" items={items} />
    </AntdStyle>
  );
}
