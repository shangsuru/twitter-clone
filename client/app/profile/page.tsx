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

type TweetData = {
  sender: string;
  handle: string;
  text: string;
  created_at: number;
};

type UserData = {
  created_at: number;
  handle: string;
  username: string;
  bio?: string;
  location?: string;
  website?: string;
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
  return tweets.map((tweet) => (
    <TweetCard
      key={tweet.handle}
      sender={tweet.sender}
      handle={tweet.handle}
      text={tweet.text}
      created_at={tweet.created_at}
    />
  ));
}

export default function Profile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [createdAt, setCreatedAt] = useState(0);

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
      res.json().then((data: UserData) => {
        setUsername(data.username);
        if (data.bio) setBio(data.bio);
        if (data.location) setLocation(data.location);
        if (data.website) setWebsite(data.website);
        setCreatedAt(data.created_at);
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
                <Typography.Link href={`https://${website}`}>
                  {website}
                </Typography.Link>
              </span>
            )}
            <span>
              <CalendarOutlined /> {timeToDate(createdAt)}
            </span>
          </p>

          <div>
            <Link href="/follow" className="no-style-link lighter-grey">
              <span>
                <Text strong>{0}</Text> Following
              </span>{" "}
              <span>
                <Text strong>{0}</Text> Followers
              </span>
            </Link>
          </div>
        </div>
        <div>
          <Image id="profile-image" preview={false} src={image} />
          <br />

          {username && (
            <EditProfileModal
              image={image}
              username={username}
              bio={bio}
              location={location}
              website={website}
              JWT={data.token}
              updateState={(
                newUsername: string,
                newBio: string,
                newLocation: string,
                newWebsite: string
              ): void => {
                setUsername(newUsername);
                setBio(newBio);
                setLocation(newLocation);
                setWebsite(newWebsite);
              }}
            />
          )}
        </div>
      </div>
      <Divider />
      <Title level={5}>Your Tweets</Title>
      <div style={{ marginTop: 20 }}>{renderTweets(ownTweets)}</div>
    </AntdStyle>
  );
}
