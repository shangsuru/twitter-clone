"use client";

import { useState, useEffect } from "react";
import { Tabs } from "antd";
import type { Tab } from "rc-tabs/lib/interface";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import UserCard from "@/components/UserCard";
import Header from "@/components/Header";
import { AntdStyle } from "../../AntdStyle";
import api from "@/utils/api";

export default function Follow({ params }: { params: { userId: string } }) {
  const [followers, setFollowers] = useState<UserData[]>([]);
  const [following, setFollowing] = useState<UserData[]>([]);

  function getFollowingandFollowers() {
    api(`users/${params.userId}/following`, "GET")
      .then((res) => res.json())
      .then((data) => {
        setFollowing(data);
      });

    api(`users/${params.userId}/followers`, "GET")
      .then((res) => res.json())
      .then((data) => {
        setFollowers(data);
      });
  }

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
          image={image}
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
          image={user.image}
        />
      )),
    },
  ];

  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  useEffect(() => {
    getFollowingandFollowers();
  }, [params.userId]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!data || !data.user || !data.user.email) {
    signOut();
    redirect("/login");
  }

  const handle = data.user.email.split("@")[0];
  const image = data.user.image ?? "/user_icon.png";

  return (
    <AntdStyle>
      <Header image={image} handle={handle} JWT={data.token} />
      <Tabs defaultActiveKey="1" items={items} />
    </AntdStyle>
  );
}
