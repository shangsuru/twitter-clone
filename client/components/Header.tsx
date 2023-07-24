"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import TweetModal from "./TweetModal";
import { LogoutButton, ProfileButton } from "./Buttons";

export default function Header({ image, handle, JWT }: LoginDataProps) {
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
        {usePathname() == `/profile/${handle}` ? (
          <LogoutButton />
        ) : (
          <>
            <ProfileButton image={image} handle={handle} />
            <TweetModal image={image} handle={handle} JWT={JWT} />
          </>
        )}
      </div>
    </div>
  );
}
