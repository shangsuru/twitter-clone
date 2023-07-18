"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Divider, Typography, Image } from "antd";
import {
  EnvironmentOutlined,
  LinkOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import TweetCard from "@/components/TweetCard";
import EditProfileModal from "@/components/EditProfileModal";
import { timeToDate } from "@/utils/utils";
import Header from "@/components/Header";
import { AntdStyle } from "../AntdStyle";

const { Title, Text } = Typography;

type UserData = {
  username: string;
  handle: string;
  bio?: string;
  location?: string;
  website?: string;
  created_at: number;
  following_count?: number;
  followers_count?: number;
};

type TweetData = {
  sender: string;
  handle: string;
  text: string;
  created_at: number;
};

export default function Profile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState(null);
  const [location, setLocation] = useState(null);
  const [website, setWebsite] = useState(null);
  const [created_at, setCreated_at] = useState(0);
  const [following_count, setFollowing_count] = useState(0);
  const [followers_count, setFollowers_count] = useState(0);

  const user: UserData = {
    username: "John Hammond",
    handle: "@_JohnHammond",
    bio: "Hacker. Friend. Cybersecurity Researcher @HuntressLabs",
    location: "San Francisco, LA",
    website: "j-h.io/links",
    created_at: 1435901330,
    following_count: 2035,
    followers_count: 196400,
  };

  const ownTweets: TweetData[] = [
    {
      sender: "John Hammond",
      handle: "@_JohnHammond",
      text: "For another fireworks show, Ignacio Dominguez and Carlos Polop from HALBORN showcase how dependency confusion attacks can occur with the AWS Code Artifact service -- potentially even having npm execute rogue code just upon install!",
      created_at: 1689315000,
    },
  ];

  function renderTweets(tweets: TweetData[]) {
    return ownTweets.map((tweet) => (
      <TweetCard
        key={tweet.handle}
        sender={tweet.sender}
        handle={tweet.handle}
        text={tweet.text}
        created_at={tweet.created_at}
      />
    ));
  }

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

  fetch(`http://localhost:4000/users/profile/${handle}`).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        console.log(data);
        setUsername(data.username);
        setBio(data.bio);
        setLocation(data.location);
        setWebsite(data.website);
        setCreated_at(data.created_at);
      });
    }
  });

  return (
    <AntdStyle>
      <Header image={image} />
      <div id="profile-header">
        <div>
          <Title level={3} style={{ marginBottom: 2 }}>
            {username}
          </Title>
          <div className="lighter-grey">@{handle}</div>
          <p>{bio}</p>
          <p id="additional-profile-info">
            {location && (
              <span>
                <EnvironmentOutlined /> {location}
              </span>
            )}
            {website && (
              <span>
                <LinkOutlined />{" "}
                <Typography.Link href={website}>{website}</Typography.Link>
              </span>
            )}
            <span>
              <CalendarOutlined /> {timeToDate(created_at)}
            </span>
          </p>

          <div>
            <Link href="/follow" className="no-style-link lighter-grey">
              <span>
                <Text strong>{following_count}</Text> Following
              </span>{" "}
              <span>
                <Text strong>{followers_count}</Text> Followers
              </span>
            </Link>
          </div>
        </div>
        <div>
          <Image id="profile-image" preview={false} src={image} />
          <br />
          <EditProfileModal />
        </div>
      </div>
      <Divider />
      <Title level={5}>Your Tweets</Title>
      <div style={{ marginTop: 20 }}>{renderTweets(ownTweets)}</div>
    </AntdStyle>
  );
}
