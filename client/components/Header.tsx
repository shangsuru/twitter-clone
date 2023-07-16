"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import TweetModal from "./TweetModal";
import { ProfileButton } from "./Buttons";

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
        <ProfileButton />
        <TweetModal />
      </div>
    </div>
  );
}
