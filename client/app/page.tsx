"use client";

import { useState, useEffect } from "react";
import { Tabs } from "antd";
import type { Tab } from "rc-tabs/lib/interface";

import { AntdStyle } from "@/app/AntdStyle";
import TweetCard from "@/components/TweetCard";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import api from "@/utils/api";

export default function Feed() {
  const [allTweets, setAllTweets] = useState<TweetData[]>([]);
  const [following, setFollowing] = useState<TweetData[]>([]);

  function getGlobalFeed() {
    api("tweets", "GET")
      .then((res) => res.json())
      .then((data) => {
        setAllTweets(data);
      });
  }

  function getPersonalFeed() {
    api(`tweets/${handle}`, "GET")
      .then((res) => res.json())
      .then((data) => {
        setFollowing(data);
      });
  }

  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  useEffect(() => {
    getGlobalFeed();
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
      label: "All",
      children: allTweets.map((tweet) => (
        <TweetCard
          editable={false}
          key={tweet.id}
          sender={tweet.sender}
          handle={tweet.handle}
          text={tweet.text}
          image={tweet.image}
          createdAt={tweet.createdAt}
          images={tweet.images}
        />
      )),
    },
    {
      key: "2",
      label: "Following",
      children: following.map((tweet) => (
        <TweetCard
          editable={false}
          key={tweet.id}
          sender={tweet.sender}
          handle={tweet.handle}
          text={tweet.text}
          image={tweet.image}
          createdAt={tweet.createdAt}
          images={tweet.images}
        />
      )),
    },
  ];

  const image = data.user.image ?? "/user_icon.png";
  const handle = data.user.email.split("@")[0];

  function onTabChange(key: string) {
    if (key === "1") {
      getGlobalFeed();
    } else {
      getPersonalFeed();
    }
  }

  return (
    <AntdStyle>
      <Header image={image} handle={handle} JWT={data.token} />
      <Tabs defaultActiveKey="1" items={items} onChange={onTabChange} />
    </AntdStyle>
  );
}
