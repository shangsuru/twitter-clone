"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Avatar, Button, Divider, Typography, Image, Modal, Input } from "antd";
import {
  EnvironmentOutlined,
  LinkOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import TweetCard from "@/components/TweetCard";
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
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function showModal() {
    setOpen(true);
  }

  function handleModalOk() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  }

  function handleModalCancel() {
    setOpen(false);
  }

  function onTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    console.log("Change:", e.target.value);
  }

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div>
          <Title level={3} style={{ marginBottom: 2 }}>
            {user.username}
          </Title>
          <div style={{ fontWeight: "lighter", color: "grey" }}>
            {user.handle}
          </div>
          <p>{user.bio}</p>
          <p
            style={{
              display: "flex",
              gap: 10,
              color: "grey",
            }}
          >
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
            <Link
              href="/follow"
              className="no-style-link"
              style={{ color: "grey" }}
            >
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
            src="https://yt3.googleusercontent.com/6FqcWoHZvrZixaGi1S3Re3Z90SCS3iq2_36hQSnSHQPtQVVkywH8WKka53MiBYBSP6DmqM-g9w=s900-c-k-c0x00ffffff-no-rj"
            width={120}
          />
          <br />
          <Button style={{ marginTop: 10 }} shape="round" onClick={showModal}>
            Edit Profile
          </Button>
          <Modal
            open={open}
            title={
              <div>
                <Avatar
                  src="https://yt3.googleusercontent.com/6FqcWoHZvrZixaGi1S3Re3Z90SCS3iq2_36hQSnSHQPtQVVkywH8WKka53MiBYBSP6DmqM-g9w=s900-c-k-c0x00ffffff-no-rj"
                  style={{ backgroundColor: "#f56a00", marginRight: 5 }}
                />

                <span>Edit Profile</span>
              </div>
            }
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            footer={[
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleModalOk}
              >
                Save
              </Button>,
            ]}
          >
            <Divider style={{ margin: 5 }} />
            <Input
              className="simple-label"
              addonBefore="Name"
              placeholder="John Hammond"
              bordered={false}
            />
            <Divider style={{ margin: 5 }} />
            <Input
              className="simple-label"
              addonBefore="Bio"
              placeholder="Add a bio to your profile"
              bordered={false}
            />
            <Divider style={{ margin: 5 }} />
            <Input
              className="simple-label"
              addonBefore="Location"
              placeholder="Add your location"
              bordered={false}
            />
            <Divider style={{ margin: 5 }} />
            <Input
              className="simple-label"
              addonBefore="Website"
              placeholder="Add your website"
              bordered={false}
            />
          </Modal>
        </div>
      </div>
      <Divider />
      <Title level={5}>Your Tweets</Title>
      <div style={{ marginTop: 20 }}>{renderTweets(ownTweets)}</div>
    </div>
  );
}
