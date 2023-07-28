"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
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
import api from "@/utils/api";
import { sign } from "crypto";

const { Title, Text } = Typography;

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
  const [ownTweets, setOwnTweets] = useState<TweetData[]>([]);

  function getUserInfo() {
    api(`users/profile/${params.userId}`, "GET", {}, data?.token).then(
      (res) => {
        if (res.ok) {
          res.json().then((data: UserData) => {
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
            setOwnTweets(data.tweets ?? []);
          });
        }
      }
    );
  }

  function follow() {
    api("users/follow", "POST", { userId: params.userId }, data?.token).then(
      (res) => {
        if (res.ok) {
          setFollowed(!followed);
          setFollowers(followers + 1);
        }
      }
    );
  }

  function unfollow() {
    api(
      "users/unfollow",
      "DELETE",
      { userId: params.userId },
      data?.token
    ).then((res) => {
      if (res.ok) {
        setFollowed(!followed);
        setFollowers(followers - 1);
      }
    });
  }

  function deleteTweet(tweet: TweetData) {
    api(`tweets/${tweet.id}`, "DELETE", {}, data?.token);
  }

  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  useEffect(() => {
    if (!data?.token) return;
    getUserInfo();
  }, [params.userId, data?.token]);

  if (status == "loading") {
    return "Loading...";
  }

  if (!data || !data.user || !data.user.email || !data.token) {
    signOut().then(() => redirect("/login"));
    return;
  }

  const ownHandle = data.user.email.split("@")[0];
  const ownImage = data.user.image ?? "/user_icon.png";

  return (
    <AntdStyle>
      <Header handle={ownHandle} image={ownImage} JWT={data.token} />
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
          <Image
            id="profile-image"
            preview={false}
            src={params.userId === ownHandle ? ownImage : image}
            alt="Profile Image"
          />
          <br />

          {params.userId === ownHandle && username && data.token && (
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
                  unfollow();
                } else {
                  follow();
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
      <div style={{ marginTop: 20 }}>
        {ownTweets.map((tweet) => (
          <TweetCard
            tweetId={tweet.id}
            editable={params.userId === ownHandle}
            key={tweet.id}
            sender={username}
            handle={handle}
            image={image}
            text={tweet.text}
            createdAt={tweet.createdAt}
            images={tweet.images}
            JWT={data.token}
            deleteTweet={() => {
              setOwnTweets(ownTweets.filter((t) => t.id !== tweet.id));
              deleteTweet(tweet);
            }}
          />
        ))}
      </div>
    </AntdStyle>
  );
}
