"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Divider, Typography, Image, Button } from "antd";
import {
  EnvironmentOutlined,
  LinkOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import TweetCard from "@/components/TweetCard";
import EditProfileModal from "@/components/EditProfileModal";
import { timeToDate } from "@/utils/utils";
import Header from "@/components/Header";
import { AntdStyle } from "../../AntdStyle";

const { Title, Text } = Typography;

type TweetData = {
  sender: string;
  handle: string;
  text: string;
  createdAt: number;
};

type UserData = {
  createdAt: number;
  handle: string;
  username: string;
  image: string;
  bio?: string;
  location?: string;
  website?: string;
  followed?: boolean;
  following?: number;
  followers?: number;
};

const ownTweets: TweetData[] = [
  {
    sender: "John Hammond",
    handle: "@_JohnHammond",
    text: "For another fireworks show, Ignacio Dominguez and Carlos Polop from HALBORN showcase how dependency confusion attacks can occur with the AWS Code Artifact service -- potentially even having npm execute rogue code just upon install!",
    createdAt: 1689315000,
  },
];

function renderTweets(tweets: TweetData[]) {
  return tweets.map((tweet) => (
    <TweetCard
      key={tweet.handle}
      sender={tweet.sender}
      handle={tweet.handle}
      text={tweet.text}
      createdAt={tweet.createdAt}
    />
  ));
}

export default function Profile({ params }: { params: { userId: string } }) {
  const [username, setUsername] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [image, setImage] = useState("/user_icon.png");
  const [createdAt, setCreatedAt] = useState(0);
  const [followed, setFollowed] = useState(false);
  const [following, setFollowing] = useState(0);
  const [followers, setFollowers] = useState(0);

  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const ownHandle = data?.user?.email!.split("@")[0];
  const ownImage = data?.user?.image ?? "/user_icon.png";

  fetch(`http://localhost:4000/users/profile/${params.userId}`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  }).then((res) => {
    if (res.ok) {
      res.json().then((data: UserData) => {
        console.log(data);
        setUsername(data.username);
        setImage(data.image);
        setHandle(data.handle);
        if (data.bio) setBio(data.bio);
        if (data.location) setLocation(data.location);
        if (data.website) setWebsite(data.website);
        setCreatedAt(data.createdAt);
        if (data.followed) setFollowed(data.followed);
        setFollowing(data.following!);
        setFollowers(data.followers!);
      });
    }
  });

  return (
    <AntdStyle>
      <Header handle={ownHandle!} image={ownImage} />
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
            <Link
              href={`/follow/${handle}`}
              className="no-style-link lighter-grey"
            >
              <span>
                <Text strong>{following}</Text> Following
              </span>{" "}
              <span>
                <Text strong>{followers}</Text> Followers
              </span>
            </Link>
          </div>
        </div>
        <div>
          <Image id="profile-image" preview={false} src={image} />
          <br />

          {params.userId == ownHandle && username && (
            <EditProfileModal
              image={ownImage}
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
          {params.userId != ownHandle && (
            <Button
              style={{ marginTop: 10 }}
              shape="round"
              onClick={() => {
                if (followed) {
                  fetch(`http://localhost:4000/users/unfollow`, {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${data.token}`,
                    },
                    body: JSON.stringify({
                      userId: params.userId,
                    }),
                  }).then((res) => {
                    if (res.ok) {
                      setFollowed(!followed);
                    }
                  });
                } else {
                  fetch(`http://localhost:4000/users/follow`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${data.token}`,
                    },
                    body: JSON.stringify({
                      userId: params.userId,
                    }),
                  }).then((res) => {
                    if (res.ok) {
                      setFollowed(!followed);
                    }
                  });
                }
              }}
            >
              {followed ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </div>
      <Divider />
      <Title level={5}>Your Tweets</Title>
      <div style={{ marginTop: 20 }}>{renderTweets(ownTweets)}</div>
    </AntdStyle>
  );
}
