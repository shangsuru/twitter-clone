"use client";
import Link from "next/link";
import { Divider, Typography, Image } from "antd";
import {
  EnvironmentOutlined,
  LinkOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import TweetCard from "@/components/TweetCard";
import EditProfileModal from "@/components/EditProfileModal";
import { timeAgo } from "@/utils/utils";

const { Title, Text } = Typography;

type UserData = {
  username: string;
  handle: string;
  bio: string;
  location: string;
  website: string;
  created_at: number;
  following_count: number;
  followers_count: number;
};

type TweetData = {
  sender: string;
  handle: string;
  text: string;
  created_at: number;
};

export default function Profile() {
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

  return (
    <div>
      <div id="profile-header">
        <div>
          <Title level={3} style={{ marginBottom: 2 }}>
            {user.username}
          </Title>
          <div className="lighter-grey">{user.handle}</div>
          <p>{user.bio}</p>
          <p id="additional-profile-info">
            <span>
              <EnvironmentOutlined /> {user.location}
            </span>
            <span>
              <LinkOutlined />{" "}
              <Typography.Link href={user.website}>
                {user.website}
              </Typography.Link>
            </span>
            <span>
              <CalendarOutlined /> {timeAgo(user.created_at)}
            </span>
          </p>

          <div>
            <Link href="/follow" className="no-style-link lighter-grey">
              <span>
                <Text strong>{user.following_count}</Text> Following
              </span>{" "}
              <span>
                <Text strong>{user.followers_count}</Text> Followers
              </span>
            </Link>
          </div>
        </div>
        <div>
          <Image
            id="profile-image"
            src="https://yt3.googleusercontent.com/6FqcWoHZvrZixaGi1S3Re3Z90SCS3iq2_36hQSnSHQPtQVVkywH8WKka53MiBYBSP6DmqM-g9w=s900-c-k-c0x00ffffff-no-rj"
          />
          <br />
          <EditProfileModal />
        </div>
      </div>
      <Divider />
      <Title level={5}>Your Tweets</Title>
      <div style={{ marginTop: 20 }}>{renderTweets(ownTweets)}</div>
    </div>
  );
}
