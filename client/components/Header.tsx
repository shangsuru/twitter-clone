"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, Button, Input, Modal } from "antd";

import TweetModal from "./TweetModal";

export default function Header() {
  return (
    <div style={{ position: "relative" }}>
      <div id="twitter-logo-container">
        <Link href="/">
          <Image
            id="twitter-logo"
            src="/twitter_logo.png"
            width={80}
            height={60}
            alt="Twitter Logo"
          />
        </Link>
      </div>
      <div id="profile-icon-tweet-button">
        <Link href="/profile">
          <Avatar
            src="https://yt3.googleusercontent.com/6FqcWoHZvrZixaGi1S3Re3Z90SCS3iq2_36hQSnSHQPtQVVkywH8WKka53MiBYBSP6DmqM-g9w=s900-c-k-c0x00ffffff-no-rj"
            className="avatar"
          />
        </Link>
        <TweetModal />
      </div>
    </div>
  );
}
